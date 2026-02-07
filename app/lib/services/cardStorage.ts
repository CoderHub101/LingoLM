import type { BaseCard } from "../types/card.types";

/**
 * Abstract storage interface for card persistence.
 * Implement this interface with your actual database (DynamoDB, PostgreSQL, etc.)
 */
export interface CardStorageProvider {
  /**
   * Save a card to a user's profile
   */
  saveCard(userId: string, card: BaseCard): Promise<void>;

  /**
   * Get all cards for a user
   */
  getUserCards(userId: string): Promise<BaseCard[]>;

  /**
   * Get a specific card by ID
   */
  getCard(userId: string, cardId: string): Promise<BaseCard | null>;

  /**
   * Delete a card from a user's profile
   */
  deleteCard(userId: string, cardId: string): Promise<void>;

  /**
   * Update an existing card (versioning)
   */
  updateCard(userId: string, card: BaseCard): Promise<void>;
}

/**
 * In-memory storage implementation for testing and development.
 * DO NOT use in production.
 */
export class InMemoryCardStorage implements CardStorageProvider {
  private storage: Map<string, Map<string, BaseCard>> = new Map();

  async saveCard(userId: string, card: BaseCard): Promise<void> {
    if (!this.storage.has(userId)) {
      this.storage.set(userId, new Map());
    }
    
    this.storage.get(userId)!.set(card.cardId, card);
  }

  async getUserCards(userId: string): Promise<BaseCard[]> {
    const userCards = this.storage.get(userId);
    if (!userCards) return [];
    
    return Array.from(userCards.values());
  }

  async getCard(userId: string, cardId: string): Promise<BaseCard | null> {
    return this.storage.get(userId)?.get(cardId) ?? null;
  }

  async deleteCard(userId: string, cardId: string): Promise<void> {
    this.storage.get(userId)?.delete(cardId);
  }

  async updateCard(userId: string, card: BaseCard): Promise<void> {
    const updatedCard = {
      ...card,
      version: incrementVersion(card.version)
    };
    
    await this.saveCard(userId, updatedCard);
  }
}

/**
 * Increments a semantic version string (e.g., "1.0" -> "1.1")
 */
function incrementVersion(version: string): string {
  const parts = version.split(".");
  const minor = parseInt(parts[1] ?? "0", 10) + 1;
  return `${parts[0]}.${minor}`;
}

/**
 * Factory function to get the appropriate storage provider.
 * Currently returns in-memory storage for development.
 * Can be extended to support DynamoDB or other backends.
 */
export function getCardStorage(): CardStorageProvider {
  // For now, always use in-memory storage
  // To add DynamoDB support, install @aws-sdk packages and configure via env vars
  return new InMemoryCardStorage();
}
