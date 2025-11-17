# LingoLM Tech Stack

Refer to the [LingoLM Master Planning Doc](master-doc.md) for context on the project goals and features, some of the information is reiterated below for ease of technology selection.

## Definitions
- Note/Card: Document for learning materials, current vocabulary, and other materials. The main data model for this feature is defined in the [Auto-Populated Cards](#auto-populated-cards). Users can edit the card as desired.

## Core Use Cases
Single word lookup: Search word → pre-populated card appears → ask LLM questions → add personal notes → save (2 minutes vs 15 minutes manual)

## Key Features

### Auto-Populated Cards
This is the data model for a vocabulary card that users engage with for learning. Users will receive a card with a predefined template to be saved to their documents and edit them like Google Docs, and a DynamoDB table with user info stores the documents in a JSON representation below.

interface document {
    documentId: string (primary key)
    word of interest: vocabulary
    template_type: string
    body: string (stringified JSON)
}

Since this schema needs to be flexible, DynamoDB is a good option to store this data in a NoSQL fashion with quick retrieval. The cards will have pre-defined templates and will be "hydrated" at runtime with [on-demand RAG](#llm-rag).

### LLM RAG
An initial setup will populate 5K most common vocabulary words as part of a global cache, which is done by RAG. This is stored in a PostgreSQL + pgvector vector database. When the user requests a word that isn't in the 5K word global cache, on-demand RAG will be performed on that word (different function). After the data is retrieved, a templating function is called to create the template for structuring the note. Prototype this starting with one foreign language. Run this multiple times to see how stochastic the method is, then fine tuned the Bedrock embeddings. The schemas for the vocabulary and contexts are below: 

CREATE TABLE words (
  word_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lemma         TEXT NOT NULL,           -- e.g., 'venir'
  lang          TEXT NOT NULL,           -- ISO 639-1 ('es','fr',...)
  definition    TEXT,
  pos           TEXT,                    -- part of speech
  freq_rank     INTEGER,                 -- lower = more common
  surface_forms TEXT[] DEFAULT '{}',     -- ['venir','vine','vengo',...]
  CONSTRAINT words_lang_lemma_uniq UNIQUE (lang, lemma),
  CONSTRAINT words_lang_chk CHECK (lang ~ '^[a-z]{2}$')
);

CREATE TABLE contexts (
  context_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word_id       UUID NOT NULL REFERENCES words(word_id) ON DELETE CASCADE,
  text          TEXT,                    -- short context sentence
  used_form     TEXT,                    -- surface form in this context (e.g., 'vine')
  cefr          cefr_level,             
  topic         TEXT[] DEFAULT '{}',     -- ['travel','past-tense']
  embedding     VECTOR(768) NOT NULL,    -- <— dimension must match your model
);

## Overall System

### Frontend
Hosted on Vercel, React Native frontend

### Backend
Flask backend, Lambda for event driven calls (the actual functions), EC2 is for MVP V2 when scale matters

### Databases
NoSQL database for user info (DynamoDB) and Vector database for 5K global cache (Postgres + PGVector)

### Cloud Tools
AWS Bedrock, DynamoDB, Lambda

## MVP V1: Single-word lookup
- Global cache for 5K common words (Bedrock, Lambda)
- LLM generation for non-cached word templates (Bedrock, Lambda, DynamoDB)
- Templates that users can edit & save to personal collection (DynamoDB)

## MVP V2: Article processing & AI Q&A assistant + Scaling
- Create multiple templated notes at once from a single media source
- Build LLM assistant - Bedrock, fine tuning
- Implement spaced repetition system (SRS) - fsrs ibrary
- Keep track of different media supporting vocab words
- User Authentication (via Google)

## Add-Ons
- User-specific caching system
- Metrics & dashboards
- Linking templates together by similarity/relevance
- Proactive recommendation for user learning