# LingoLM MVP v1 Tech Stack Rewritten

## Goal
Implement MVP v1 in the cheapest and simplest way possible:
- Single-word lookup -> auto-populated card -> ask questions about nuance -> add notes -> save
- Minimal infrastructure, minimal operational overhead

## Non-Goals (v2+)
- Article ingestion and vocabulary extraction
- Full-text search across user notes
- Tags, linking, spaced repetition system (SRS), export
- Embeddings, vector search, “RAG” over a corpus

## Architecture Summary
- Client: Web app (responsive)
- Auth: Direct Google OAuth 2.0
- API: Amazon API Gateway (HTTP API) + AWS Lambda
- Persistent Storage: DynamoDB (UserCards + Dictionary)
- Cache: AWS ElastiCache (WordCache with TTL)
- LLM: Gemini 3.5 Flash (example sentence generation and fallback word generation)
- Observability: CloudWatch Logs + basic metrics

## Frontend
### Choice
- Next.js web app (responsive)
### Hosting
- Vercel (fastest iteration)

## Backend
- API Gateway (HTTP API) + Lambda
- API Gateway validates Google-issued tokens or app session identity for protected routes
### Lambda functions (recommended)
- GET /lookup?lang=&lemma=
- POST /cards (create/update user card)
- GET /cards (list user cards)
- POST /chat (nuance Q&A for a word/card)

### Word Lookup Flow
When a user searches for a word:
1. Check WordCache (ElastiCache)
   - If the word exists in cache, immediately return the cached card.
2. Check Dictionary (DynamoDB)
   - If found:
      - Retrieve the dictionary entry.
      - Generate example sentence(s) using Gemini 3.5 Flash.
      - Assemble the complete card.
      - Cache the result in WordCache (with TTL).
      - Return the card.
3. Dictionary Miss
   - Generate the entire card using Gemini 3.5 Flash.
   - (Post-MVP: generated entries should be validated before permanent inclusion in the dictionary.)
   - Cache the generated card in WordCache (with TTL).
   - Return the generated card.
4. User Saves the Word
   - Store a user-owned copy of the card in UserCards.
   - User modifications remain independent of future cache updates.


## Data Storage
1. Dictionary
Stores curated dictionary entries used for vocabulary lookups.
- Partition Key
  - langLemma
- Attributes
  - lang
  - lemma
  - definitions
  - parts of speech
  - translations (if applicable)
  - metadata
Example sentences are generated dynamically by Gemini rather than stored in the dictionary.


2. UserCards
Stores user-owned vocabulary cards.
- Partition Key
  - PK = USER#{userId}
- Sort Key
  - SK = CARD#{lang}#{lemma}#{cardId}
- Attributes
  - lang
  - lemma
  - card (Map)
  - notes
  - createdAt
  - updatedAt

## LLM Usage
### Dictionary Entries
For words found in the dictionary:
- Gemini 3.5 Flash generates natural example sentence(s).
- The generated examples are combined with the dictionary entry before being returned.
### Fallback Generation
For words not found in the dictionary:
- Gemini 3.5 Flash generates a complete vocabulary card.
- Generated cards are cached for future lookups.
- Future versions may include a validation pipeline before adding generated entries to the permanent dictionary.


### Nuance Q&A
- Gemini answers user questions using:
  - dictionary information or generated card 
  - user edits
  - user notes

## Cost/Simplicity Principles
- Avoid always-on databases (no RDS/Postgres for v1)
- Avoid embeddings/vector search until there is a real corpus and a clear retrieval need
- Keep a single backend deployment model (API Gateway + Lambda)
- Use DynamoDB as the only persistent store in v1
- Use cache expiration (TTL) rather than manual cache management whenever possible.

## v2 Roadmap Hooks
- Article ingestion pipeline: paste article -> extract candidate words -> batch card generation
- Search/tags/linking/SRS: add secondary indexes and/or a dedicated search service later
- True RAG: only after choosing a grounded corpus (user-provided texts or curated examples) and defining retrieval objectives
- Store chat history per card later
