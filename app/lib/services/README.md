# Card Templating & Storage Services

This directory contains the core services for creating and persisting language learning cards.

## Quick Start

```typescript
import { createBaseCard } from "./cardTemplating";
import { getCardStorage } from "./cardStorage";

// 1. Create a card from AI-generated data
const card = createBaseCard({
  language: "Spanish",
  lemma: "hablar",
  partOfSpeech: "verb",
  definitions: [
    { definition: "to speak, to talk" }
  ],
  examples: [
    { sentence: "Ella habla tres idiomas." }
  ],
  ipa: "aˈβlaɾ"
});

// 2. Save to user profile
const storage = getCardStorage();
await storage.saveCard("user-123", card);
```

## Architecture

### cardTemplating.ts
- **`createBaseCard(input)`** - Templates linguistic data into standardized JSON
- **`validateCardInput(input)`** - Validates input before card creation
- **`createBaseCardBatch(inputs)`** - Bulk card creation

### cardStorage.ts
- **Abstract interface** - `CardStorageProvider` for database-agnostic persistence
- **In-memory implementation** - For testing and development
- **Factory function** - `getCardStorage()` returns configured provider

## API Routes

- `POST /api/cards` - Create new card
- `GET /api/cards` - Get all user's cards
- `GET /api/cards/[cardId]` - Get specific card
- `PUT /api/cards/[cardId]` - Update card (versioned)
- `DELETE /api/cards/[cardId]` - Delete card

## Best Practices

✅ **DO:**
- Keep cards immutable once learned
- Version cards instead of regenerating IDs
- Validate input before card creation
- Use the abstract storage interface for flexibility
- Attach learning progress separately from cards

❌ **DON'T:**
- Let LLMs write directly to database
- Regenerate card IDs on edits
- Store progress data inside cards
- Skip input validation

## Testing

```typescript
import { InMemoryCardStorage } from "./cardStorage";

const storage = new InMemoryCardStorage();
const card = createBaseCard(testInput);
await storage.saveCard("test-user", card);

const retrieved = await storage.getCard("test-user", card.cardId);
expect(retrieved).toEqual(card);
```
