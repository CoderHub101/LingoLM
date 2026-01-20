# LingoLM MVP v1 Tech Stack (Recommended)

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
- Auth: Amazon Cognito with Google IdP
- API: Amazon API Gateway (HTTP API) + AWS Lambda
- Data: DynamoDB only (WordCache + UserCards)
- LLM: Amazon Bedrock (structured JSON generation for base cards; chat for nuance Q&A)
- Observability: CloudWatch Logs + basic metrics

## Frontend
### Choice
- Next.js web app (responsive)
### Hosting
- Vercel (fastest iteration)

## Backend
- API Gateway (HTTP API) + Lambda
- API Gateway uses a Cognito JWT authorizer for protected routes
### Lambda functions (recommended)
- GET /lookup?lang=&lemma=
- POST /cards (create/update user card)
- GET /cards (list user cards)
- POST /chat (nuance Q&A for a word/card)

### Core behaviors
- Lookup uses lazy caching:
  - WordCache hit: return cached base card JSON
  - WordCache miss: call Bedrock -> store base card -> return
- Save stores a user-owned copy (UserCards) that can diverge from the base card
- Chat calls Bedrock with (base card + user edits + notes + question) and returns an answer

## Data Storage
### DynamoDB tables
1) WordCache (global)
- Partition key: PK = LANG#{lang}
- Sort key:      SK = LEMMA#{lemma}
- Attributes:
  - baseCard (Map)
  - generatedAt (ISO string)
  - modelId (string)
  - promptVersion (string)
  - schemaVersion (string)

2) UserCards (per-user)
- Partition key: PK = USER#{userId}
- Sort key:      SK = CARD#{lang}#{lemma}#{cardId}
- Attributes:
  - lang (string)
  - lemma (string)
  - card (Map)          # user-editable structured fields
  - notes (string)
  - createdAt (ISO string)
  - updatedAt (ISO string)
  - baseRef:
      - cachePK (string)
      - cacheSK (string)
      - schemaVersion (string)
      - promptVersion (string)

### Notes on schema
- Store card bodies as DynamoDB Map types (not stringified JSON)
- Version fields allow safe migrations and gradual regeneration of cached cards

## Bedrock Usage (No RAG in v1)
### Base card generation
- Bedrock generates a structured “base card” JSON for a lemma using a strict schema and deterministic prompt
- No embeddings, no vector database, no retrieval pipeline

### Nuance Q&A
- Bedrock answers user questions using:
  - base card
  - user edits
  - user notes

## Cost/Simplicity Principles
- Avoid always-on databases (no RDS/Postgres for v1)
- Avoid embeddings/vector search until there is a real corpus and a clear retrieval need
- Keep a single backend deployment model (API Gateway + Lambda)
- Use DynamoDB as the only persistent store in v1

## v2 Roadmap Hooks
- Article ingestion pipeline: paste article -> extract candidate words -> batch card generation
- Search/tags/linking/SRS: add secondary indexes and/or a dedicated search service later
- True RAG: only after choosing a grounded corpus (user-provided texts or curated examples) and defining retrieval objectives
- Store chat history per card later