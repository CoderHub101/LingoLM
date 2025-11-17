# LingoLM Master Planning Doc

## Problem Statement
Manually creating vocabulary notes is tedious (10-15 minutes per word), discouraging learners from documenting encountered words. Intermediate learners need deep contextual understanding and nuances, not just basic definitions. Current tools (dictionaries, language apps, flashcard tools) require users to manually find examples, write definitions, and identify related words.
The main idea is a contextual, proactive, on demand platform readily available for users to learn commonly used vocabulary and master its context, discern between different uses of the word, focus on a catered topics of the language learning without spending lots of time and searching through media 

## Solution
- Platform auto-populates vocabulary cards with definitions, example sentences, related words
- Users can add personal notes and insights to add on to the card, LLM serves as interactive Q&A assistant for clarifying nuances while building notes
- Personal collection acts as knowledge base with search, tags, linking, spaced repetition, and export (MVP v2)

## Target Audience
Intermediate language learners (B1-B2 level) consuming authentic content who want depth over breadth

## Core Use Cases
Single word lookup: Search word → pre-populated card appears → ask LLM questions → add personal notes → save (2 minutes vs 15 minutes manual)

Article processing (V2): Paste article → Bedrock identifies important vocabulary → batch generate pre-populated cards → review and add notes → save collection 

## Key Features
- Auto-populated cards (definitions, examples, related words, patterns)
- Editable templates - users can modify/customize everything
- LLM advisor for usage questions and nuance explanations
- Personal knowledge base with tags, search, and linking between cards
- Spaced repetition review 

## Analogy
"Obsidian for language vocabulary" - personal knowledge base tool where the platform does the grunt work and users focus on understanding