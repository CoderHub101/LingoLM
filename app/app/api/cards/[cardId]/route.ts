import { NextRequest, NextResponse } from "next/server";
import { getCardStorage } from "@/lib/services/cardStorage";
import { createBaseCard, validateCardInput } from "@/lib/services/cardTemplating";

/**
 * GET /api/cards/[cardId]
 * Retrieves a specific card by ID.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    const userId = request.headers.get("x-user-id") ?? "demo-user";
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const storage = getCardStorage();
    const card = await storage.getCard(userId, params.cardId);

    if (!card) {
      return NextResponse.json(
        { error: "Card not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        card 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching card:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch card",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/cards/[cardId]
 * Updates an existing card (creates a new version).
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    const userId = request.headers.get("x-user-id") ?? "demo-user";
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const storage = getCardStorage();
    const existingCard = await storage.getCard(userId, params.cardId);

    if (!existingCard) {
      return NextResponse.json(
        { error: "Card not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Validate input
    try {
      validateCardInput(body);
    } catch (validationError) {
      return NextResponse.json(
        { 
          error: "Invalid input", 
          details: validationError instanceof Error ? validationError.message : "Unknown error"
        },
        { status: 400 }
      );
    }

    // Create new version of the card with the same ID
    const updatedCard = createBaseCard(body);
    updatedCard.cardId = params.cardId; // Preserve the original card ID

    await storage.updateCard(userId, updatedCard);

    return NextResponse.json(
      { 
        success: true, 
        card: updatedCard,
        message: "Card updated successfully" 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating card:", error);
    return NextResponse.json(
      { 
        error: "Failed to update card",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cards/[cardId]
 * Deletes a card from the user's profile.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    const userId = request.headers.get("x-user-id") ?? "demo-user";
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const storage = getCardStorage();
    await storage.deleteCard(userId, params.cardId);

    return NextResponse.json(
      { 
        success: true,
        message: "Card deleted successfully" 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting card:", error);
    return NextResponse.json(
      { 
        error: "Failed to delete card",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
