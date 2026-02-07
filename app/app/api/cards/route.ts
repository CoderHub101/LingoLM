import { NextRequest, NextResponse } from "next/server";
import { createBaseCard, validateCardInput } from "@/lib/services/cardTemplating";
import { getCardStorage } from "@/lib/services/cardStorage";

/**
 * POST /api/cards
 * Creates a new card and saves it to the user's profile.
 * 
 * Request body should match BaseCardInput interface.
 * Returns the created card with its generated ID.
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Replace with actual auth - get userId from session
    const userId = request.headers.get("x-user-id") ?? "demo-user";
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
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

    // Create the card
    const card = createBaseCard(body);

    // Save to storage
    const storage = getCardStorage();
    await storage.saveCard(userId, card);

    return NextResponse.json(
      { 
        success: true, 
        card,
        message: "Card created successfully" 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating card:", error);
    return NextResponse.json(
      { 
        error: "Failed to create card",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/cards
 * Retrieves all cards for the authenticated user.
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Replace with actual auth
    const userId = request.headers.get("x-user-id") ?? "demo-user";
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const storage = getCardStorage();
    const cards = await storage.getUserCards(userId);

    return NextResponse.json(
      { 
        success: true, 
        cards,
        count: cards.length 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch cards",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
