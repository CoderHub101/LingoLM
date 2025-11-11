# LingoLM Tech Stack

Refer to the [LingoLM Master Planning Doc](master-doc.md) for context on the project goals and features, some of the information is reiterated below for ease of technology selection.

## Definitions
- Card: Template for learning materials, current vocabulary, and other materials. The main data model for this feature is defined in the [Auto-Populated Cards](#auto-populated-cards). Users can edit the card as desired.

## Core Use Cases
Single word lookup: Search word → pre-populated card appears → ask LLM questions → add personal notes → save (2 minutes vs 15 minutes manual)
Article processing: Paste article → NLP identifies important vocabulary (intermediate-level content words) → batch generate pre-populated cards → review and add notes → save collection

## Key Features
- Auto-populated cards (definitions, examples, related words, patterns) that users can edit
- LLM advisor for usage questions and nuance explanations
- Personal knowledge base with tags, search, and linking between cards
- Spaced repetition review system
- Learning dashboard

### Auto-Populated Cards
This is the data model for a vocabulary card (template) that users engage with for learning. Users can choose to save these templates and edit them like Google Docs, and the DynamoDB table with user info stores the document IDs they've saved. It will also be saved to S3 for storing the actual document metadata/structure. The retrieval process would be searching in DynamoDB then fetching the document body (as a JSON) from S3. 

interface template {
    word of interest: vocabulary
    context: string
    templateId: string
    belongsTo: string (username)
}

interface vocabulary {
    word: string
    definition: string
    contexts: string[]
    numSearches: int
}

Since this schema needs to be flexible, DynamoDB is a good option to store this data in a NoSQL fashion with quick retrieval. The cards will have pre-defined templates and will be "hydrated" at runtime with the [RAG hydration](#rag-hydration).

interface media {
    type: string
    pathOrUrl: string
    provider: string
    numUsages/numSearches: int
}

The media data model will not store all of the vocabulary words because that would be inefficient for vocabulary-filled documents. The media is found at runtime by different scraping methods defined by a predetermined database of the most popular topics. The number of usages tells how popular a media source is for learning, and future requests of the same vocabulary word will work to select the media with the number of usages. A benchmark will be performed to test this out.

### RAG Hydration
An initial setup will populate 5000 most common vocabulary words across most common contexts, which is done by RAG. Upon the user asking the LLM a specific vocabulary word and generating a lesson plan, AWS Lambda runs the RAG hydration function from Bedrock embeddings which populates the data into the template. Prototype this starting with one foreign language. Run this multiple times to see how stochastic the method is, then fine tune the Bedrock embeddings.

### LLM Advisor
Fine-tuned to help users with contextual usages of vocabulary, explaining nuances, and assessing the user's areas of improvement while learning vocabulary in a specific topic.

User finishes LLM chat session → S3 stores session logs → S3 event triggers Lambda → Lambda starts Bedrock fine tune job

### Personal Knowledge Base
Similarly to Google Docs, our system stores the documents that they saved for learning each vocab word, links related words/contexts (by recommendation), and tags for language, topic, starred. User cache for recent chats is an add-on for later.

An S3 bucket to store the actual document bodies and DynamoDB to store each user's documents (that will be the same table as the user info) 

interface user {
    username: string
    password: string (hashed & encrypted)
    date_joined: string
    documents: string[] (query in S3 with doc ID)
}

### Spaced Repetition Review System
The user clicks a Button "Study" by the page that serves the document. It adds the card to a list of actionable tasks. Retrieving it calls a GET request for /srs/due for actionable tasks for their learning. Return the N next due items. When the user gives answers (typing/speaking/MCQ) client calls POST /srs/grade. Flask involves a Lambda function that's an LLM judge which returns a grade of 0-5 and feedback. Then, Flask updates SRS parameters (ease factor, reps, lapses, interval, next due) for that (user, item) in DynamoDB. Return overall feedback after the session and the item's next review time. DynamoDB will compute what is due.

Data model (DynamoDB single-table)

Partition/SORT keys

PK = USER#{userId}
SK = ITEM#{itemId}

Attributes (per user–item SRS state)
{
  "PK": "USER#u123",
  "SK": "ITEM#venir",
  "ef": 2.5,
  "reps": 0,
  "lapses": 0,
  "interval_days": 0,
  "next_due_ts": 0,
  "last_grade": 0,
  "last_review_ts": 0,
  "lang": "es",
  "tags": ["verb","A2","travel"],
  "version": 7
}

### Learning Plan Dashboard
This would involve compiling template information, user data, and different media the user engaged with. This is a very nice to have but not the utmost priority right now for our MVP.

AWS Cloudwatch for showing dashboards for metrics, user's most commonly searched topics of vocabulary. CDK defined metrics and TypeScript defines the dashboard templates if linked with the code that emits the metrics. 

## Overall System

### Frontend
Hosted on Vercel, React Native frontend

### Backend
Flask backend, deploy to EC2 (via Docker), Lambda for event driven calls (the actual functions)

### Databases
There will be multiple databases of information to store:
- NoSQL database for user preferences, templates, and data: DynamoDB, S3 for file storage
- NoSQL database for globally cached 5K words: DynamoDB
- Vector database for vocabulary retrieved from Bedrock RAG: Postgres + PGVector

### Cloud Tools
AWS EC2, S3, Bedrock, ElastiCache (Redis), Cloudwatch, DynamoDB, Lambda

## Cost Analysis
To get a MVP (Minimum Viable Product) working for proof-of-concept, we only need S3, Bedrock, DynamoDB, Lambda, and EC2 for cloud tools. Postgres + pgvector on EC2 is cheaper for vector search than OpenSearch. Try free tier of everything ($100 seed), but use it wisely once you know your code is working.

## Proof of Concept Stage
We need to achieve the following before we do scaled deployment:
- Create a RAG function that pulls 50 most common vocabulary words for one language (Bedrock embeddings, Postgres)
- Support user signup with Google
- Have a working LLM generation system for making vocab cards (Bedrock, Lambda, DynamoDB, Postgres)
- Saving templates and being able to retrieve them later (S3, DynamoDB)
- Serve an LLM advisor to help the user with contextual word understanding (Bedrock chat, fine tuned)
- Spaced Repetition Review System (Lambda, DynamoDB, Flask REST API)

## Add-Ons
- Editing the document Google Docs style
- User-specific caching system
- Cloudwatch metrics & dashboards
- Linking templates together by similarity/relevance
- Proactive recommendation for user learning