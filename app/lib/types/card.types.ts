/**
 * Input data structure for creating base cards
 */
export interface BaseCardInput {
  language: string;
  lemma: string;
  partOfSpeech: string;
  definitions: Array<{
    definition: string;
    register?: string;
    domain?: string;
  }>;
  examples: Array<{
    sentence: string;
    difficulty?: "easy" | "medium" | "hard";
    contextTag?: string;
  }>;
  ipa?: string;
  synonyms?: string[];
}

/**
 * Complete base card schema
 */
export interface BaseCard {
  cardId: string;
  language: string;
  lemma: string;
  normalizedLemma: string;

  partOfSpeech: string;
  otherForms: string[];

  phonetics: {
    ipa: string;
    respelling: string;
  };

  definitions: Array<{
    definition: string;
    register: string;
    domain: string;
    confidence: number;
  }>;

  coreMeaning: string;

  examples: Array<{
    sentence: string;
    highlightedLemma: string;
    difficulty: "easy" | "medium" | "hard";
    contextTag: string;
    sourceType: string;
  }>;

  collocations: Array<{
    phrase: string;
    context?: string;
  }>;

  synonyms: Array<{
    word: string;
    nuance: string;
  }>;

  antonyms: Array<{
    word: string;
    nuance: string;
  }>;

  usageNotes: string[];

  semanticRelations: {
    hypernyms: string[];
    hyponyms: string[];
    relatedConcepts: string[];
  };

  etymology: {
    origin: string;
    evolution: string;
  };

  voiceout: {
    ttsText: string;
    slowTtsText: string;
    pronunciationHint: string;
  };

  learningAids: {
    mnemonic: string;
    visualCue: string;
  };

  aiGrounding: {
    allowedScope: string;
    ambiguityNotes: string;
  };

  version: string;
  createdBy: string;
  qualityScore: number;
  createdAt: string;
}

/**
 * User profile structure with cards
 */
export interface UserProfile {
  userId: string;
  cards: Record<string, BaseCard>;
  updatedAt: string;
  createdAt: string;
}
