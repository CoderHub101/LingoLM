## Key Competitors by Category

### 1. AI Flashcard Generators

Uses OCR and AI to generate study materials
#### Competitors
- **FlashRecall** - generates flashcards from any study material & has SRS
- **Laxu AI** - General study assistant, converts content to study content (flashcards, notes, quizzes)
    - Motto: "Focus on learning, not formatting"
- **NewWord** - AI-powered multilingual vocabulary notebook
    - AI generates definitions from typed words or OCR
    - Photo OCR to scan words from textbooks
    - Can translate words into multiple languages simultaneously
    - Spaced repetition review system
- **AlgoApp** - General flashcard app with AI features
    - AI converts PDFs/notes/images into flashcards
    - Auto-translation (120 languages)
    - Auto-generates pinyin for Chinese, furigana for Japanese
    - Advanced SRS algorithm (developed by neuroscientist)
    - Premium: ~$50 one-time or subscription
#### Pros
- Convenient - snap photo & generate
- AlgoApp: Neuroscientist-designed algorithm, supports Chinese pinyin
- NewWord: Multilingual translation at once
#### Cons
- FlashRecall & Laxu AI : Not language-specific
- NewWord: Shallow content (just definitions, no examples or patterns)
- AlgoApp: Android app has major bugs, expensive, no LLM Q&A

---
### 2. Mix of Anki + Obsidian: Mochi

SRS flashcard system using markdown
#### Pros
- Local-first (like Obsidian) -- data is private, don't need internet access to use it
- Uses markdown (like Obsidian) -- flexibility in formatting & converts to many other formats quickly
- Much better UI than Anki's
- Has dashboard of user's learning stats & activity (like GitHub's)
- Can create knowledge graph (like Obsidian) -- see relationships between cards
- Can create "note" cards too (single-sided)
- Built-in language tools: dictionary lookup, translation, text-to-speech
#### Cons
- **Still requires manual card creation** (10-15 min per card)
- Uses dictionary/translation APIs, NOT generative AI
- FSRS is bad -- only have "remember / forgot" options for spaced repetition
- Uses markdown -- can be a learning curve for those that aren't familiar with it
- Limited export features
- Desktop app is free, but must subscribe for syncing features -- aka must pay for sync to mobile ($5/month)

---
### 3. Japanese-Specialized Tools

#### Kitsun.io - Japanese SRS with reading integration (Closest competitor for Japanese)

**Pricing**: $5/month or $160 lifetime
##### Pros
- **One-click flashcard creation while reading** - click any word in Japanese text → instant definition → create card
- Reading tool parses Japanese text with furigana automatically
- Import videos/subtitles from anime/shows
- Beautiful, modern UI (praised as "better than Anki")
- Highly customizable templates
- Integration with Jisho.org dictionary
- Community decks with collaborative improvement
- Tracks knowledge at word level
##### Cons
- **User still manually creates cards** - just made easier with one-click
- **No AI content generation** - just dictionary lookup
- Cards are basic: word + definition (user must add examples, notes, patterns)
- No LLM Q&A
- Japanese only
- Web-only (no native apps)

---
#### Renshuu - Comprehensive Japanese learning platform

**Pricing**: Free (with optional pro features)
##### Pros
- Complete learning system (vocabulary, kanji, grammar, writing, reading)
- Highly customizable - matches textbooks (Genki, Tobira), JLPT levels, or self-study
- Tracks knowledge at individual kanji level
- Adjusts furigana display based on what you know
- Grammar lessons written by Japanese professor
- Study games (Shiritori, Counter Punch, Crosswords)
- Community features
- **100% free** with no paywalls or timers
- Cute mascot and gamification
##### Cons
- **Comprehensive platform, not a focused tool** (different category than LingoLM)
- No AI generation
- Course-based (structured lessons)
- No knowledge base features
- More gamified (not just a productivity tool)

---
### 4. Video-Based Vocabulary: Lingo Llama

Learn Spanish vocabulary from movie clips
#### Pros
- Learn from context & cultural immersion
- Has in-app dictionary & translation
- Teaches grammar
- Has SRS
#### Cons
- Spanish only
- No customization -- cannot create your own card
- Costly -- high subscription costs
- Pre-selected content (user can't choose videos)

---
### 5. Sentence-Based Learning: Taalhammer

User creates their own sentences, practices with spaced repetition
#### Pros
- Contextual learning -- focuses on sentences, not single words
- SRS
- Customizable -- user can add their own cards
- Audio to hear pronunciation
- Supports many languages (75+)
- AI-powered topic collections (recently added)
- Sentence-focused review builds production skills
#### Cons
- **User still manually creates content** - AI only generates audio/translation, not sentences
- Different learning focus (sentence production vs vocabulary comprehension)
- Not vocabulary-specific
- No knowledge base features

---
### 6. Dictionary: Pleco

Leading app for Chinese dictionary lookup -- the holy grail Chinese dictionary
#### Pros
- Offline -- no need for internet access; can study anywhere, anytime
- Mobile -- convenient to study anywhere, anytime
- Contextual - provides example sentences
- Results show definitions from multiple sources
- Audio for pronunciation
- Search by pinyin, typed characters, or handwritten characters
#### Cons
- Outdated & unintuitive UI
- Mobile only
- Pay for add-ons like SRS and OCR features
- **No AI generation** - just dictionary lookup
- Basic flashcards (manual creation)
- No knowledge base features

---
## So what about LingoLM?

LingoLM is a **tool**, NOT a learning platform
### What LingoLM Offers That Competitors Don't

| Feature                  | Competitors                                  | LingoLM                                        |
| ------------------------ | -------------------------------------------- | ---------------------------------------------- |
| **Language-specialized** | FlashRecall, Laxu AI, AlgoApp (generic)      | definitions, pronunciation, context            |
| **AI card generation**   | Mochi, Kitsun.io, Pleco, Taalhammer (manual) | Comprehensive: definitions, examples, patterns |
| **LLM Q&A assistant**    | None                                         | Ask questions, explore nuances interactively   |
| **Speed**                | Mochi: 10-15 min, Kitsun: 2-3 min            | 30 sec (10x faster)                            |
### Target User Gap Analysis

**What intermediate Chinese learners currently do:**

```
Use Pleco for quick lookup
  +
Use Anki for flashcards (10-15 min manual creation)
  +
Use ChatGPT for understanding nuances (no persistence)
  =
Fragmented workflow, time-consuming
```

**What LingoLM offers:**

```
One tool that combines:
- Pleco's mobile convenience
- AI generation (better than manual Mochi)
- LLM Q&A (better than ChatGPT - saves to cards)
- Knowledge base (like Obsidian)
  =
Unified, fast, intelligent
```

---
### Product Decisions from Analysis
#### Mobile-First
- **Why**: Most convenient when learner encounters a new word
- **Competitors**:
    - Pleco is praised bc it's mobile and instant
    - Kitsun.io is web-only (no native apps)
    - Mochi requires subscription for mobile sync
- **Decision**: Build PWA for native app-like experience
    - Works on mobile immediately
    - One codebase for mobile + desktop
    - Can install to home screen
#### Manual Card Creation Feature
- **Why**: Power users want flexibility for sentences, grammar, notes
- **Competitors**:
    - Taalhammer focuses on sentences but requires manual input
    - Renshuu is comprehensive but no custom cards for random content
    - Mochi is only manual input card creation
- **Decision**: Add "Create Manual Card" for customizability
    - Solves sentence use case
    - Users can create cards for anything AI doesn't handle
    - Same review system as AI cards
    - $0 Bedrock cost
#### No Markdown (MVP)
- **Why**: Users aren't typing content (AI generates it)
- **Competitors**:
    - Mochi users manually write everything in markdown
    - Our users have the **option** to edit cards
- **Decision**: Simple rich text editor for MVP
    - Better for mobile UX
    - Faster development