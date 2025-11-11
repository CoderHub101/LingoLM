# LingoLM Master Planning Doc

## Problem Statement
Manually creating vocabulary notes is tedious (10-15 minutes per word), discouraging learners from documenting encountered words. Intermediate learners need deep contextual understanding and nuances, not just basic definitions. Current tools (dictionaries, language apps, flashcard tools) require users to manually find examples, write definitions, and identify related words

## Tenets
The main idea is a contextual, proactive, on demand platform readily available for users to learn commonly used vocabulary and master its context, discern between different uses of the word, focus on a catered topics of the language learning without spending lots of time and searching through media 

## Solution
Platform auto-populates vocabulary cards with definitions, example sentences, related words, patterns, and difficulty/frequency data
Users only add personal notes and insights (90% automation, 10% personalization)
LLM serves as interactive Q&A assistant for clarifying nuances while building notes

Personal collection acts as knowledge base with search, tags, linking, spaced repetition, and export

## Target Audience
Intermediate language learners (B1-B2 level) consuming authentic content who want depth over breadth

## Core Use Cases
Single word lookup: Search word → pre-populated card appears → ask LLM questions → add personal notes → save (2 minutes vs 15 minutes manual)
Article processing: Paste article → NLP identifies important vocabulary (intermediate-level content words) → batch generate pre-populated cards → review and add notes → save collection

## Key Features
- Auto-populated cards (definitions, examples, related words, patterns)
- Editable templates - users can modify/customize everything
- LLM research assistant for usage questions and nuance explanations
- Personal knowledge base with tags, search, and linking between cards
- Spaced repetition review system
- Export to Obsidian, Anki, Notion

## Analogy
"Obsidian for language vocabulary" - personal knowledge base tool where the platform does the grunt work and users focus on understanding

## Sample UX
I am a user who wants to learn Chinese. I do an initial setup that gives my user preferences for the language I want to learn, what I want to learn the language for (contexts: e.g. conversational, traveling, business, etc), and use Spaced Repetition System to remember it. I start by chatting with the LLM advisor about the vocab, context, and example usages. Then it gives me a template that I can edit and save based on how I want to learn it and what information I'm interested in. As I view the template, there is a "Study" option to practice SRS. After that, I want to be able to go back to that document and know what I still need to improve on from the SRS algorithm data that's saved from last session. 