import { randomUUID } from "crypto";
import type { BaseCardInput, BaseCard } from "../types/card.types";

/**
 * Creates a fully-formed baseCard from validated input data.
 * This function templates linguistic data into a standardized JSON structure.
 * 
 * @param input - Validated linguistic data from AI pipeline or upstream service
 * @returns A complete BaseCard object ready for persistence
 */
export function createBaseCard(input: BaseCardInput): BaseCard {
  const now = new Date().toISOString();

  return {
    cardId: randomUUID(),
    language: input.language,
    lemma: input.lemma,
    normalizedLemma: input.lemma.toLowerCase().trim(),

    partOfSpeech: input.partOfSpeech,
    otherForms: [],

    phonetics: {
      ipa: input.ipa ?? "",
      respelling: ""
    },

    definitions: input.definitions.map(d => ({
      definition: d.definition,
      register: d.register ?? "neutral",
      domain: d.domain ?? "general",
      confidence: 0.9
    })),

    coreMeaning: input.definitions[0]?.definition ?? "",

    examples: input.examples.map(e => ({
      sentence: e.sentence,
      highlightedLemma: input.lemma,
      difficulty: e.difficulty ?? "medium",
      contextTag: e.contextTag ?? "daily",
      sourceType: "constructed"
    })),

    collocations: [],
    
    synonyms: (input.synonyms ?? []).map(word => ({
      word,
      nuance: ""
    })),
    
    antonyms: [],

    usageNotes: [],
    
    semanticRelations: {
      hypernyms: [],
      hyponyms: [],
      relatedConcepts: []
    },

    etymology: {
      origin: "",
      evolution: ""
    },

    voiceout: {
      ttsText: input.lemma,
      slowTtsText: input.lemma,
      pronunciationHint: ""
    },

    learningAids: {
      mnemonic: "",
      visualCue: ""
    },

    aiGrounding: {
      allowedScope: "Only answer questions using this card's data and general linguistic knowledge.",
      ambiguityNotes: ""
    },

    version: "1.0",
    createdBy: "ai",
    qualityScore: 0.85,
    createdAt: now
  };
}

/**
 * Validates input data before card creation.
 * Throws descriptive errors if validation fails.
 * 
 * @param input - Data to validate
 * @throws Error if validation fails
 */
export function validateCardInput(input: unknown): asserts input is BaseCardInput {
  const data = input as Partial<BaseCardInput>;

  if (!data.language || typeof data.language !== "string") {
    throw new Error("Invalid or missing language");
  }

  if (!data.lemma || typeof data.lemma !== "string") {
    throw new Error("Invalid or missing lemma");
  }

  if (!data.partOfSpeech || typeof data.partOfSpeech !== "string") {
    throw new Error("Invalid or missing part of speech");
  }

  if (!Array.isArray(data.definitions) || data.definitions.length === 0) {
    throw new Error("Definitions must be a non-empty array");
  }

  if (!Array.isArray(data.examples) || data.examples.length === 0) {
    throw new Error("Examples must be a non-empty array");
  }
}

/**
 * Creates multiple cards in batch from an array of inputs.
 * Useful for bulk import operations.
 * 
 * @param inputs - Array of card inputs
 * @returns Array of created cards
 */
export function createBaseCardBatch(inputs: BaseCardInput[]): BaseCard[] {
  return inputs.map(input => createBaseCard(input));
}
