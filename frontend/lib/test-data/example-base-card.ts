import type { BaseCard } from '@/types/vocabulary'

/** A realistic word-lookup Lambda response, used only for local smoke tests. */
export const exampleBaseCard: BaseCard = {
  baseCardId: 'zh#电脑#dian4-nao3',
  language: 'zh',
  lemma: '电脑',
  normalizedLemma: '电脑',
  forms: { simplified: '电脑', traditional: '電腦', variants: [] },
  romanization: { system: 'pinyin', value: 'diànnǎo' },
  definitions: [
    { id: 'def_1', text: 'computer', partOfSpeech: 'noun' },
    { id: 'def_2', text: 'electronic brain; computer', register: 'informal' },
  ],
  examples: [
    {
      id: 'ex_1',
      source: '我买了一台新电脑。',
      romanization: 'Wǒ mǎi le yì tái xīn diànnǎo.',
      translation: 'I bought a new computer.',
      definitionId: 'def_1',
    },
  ],
  relatedWords: [{ id: 'rel_1', lemma: '笔记本电脑', romanization: 'bǐjìběn diànnǎo', relation: 'related' }],
  collocations: [{ id: 'col_1', text: '用电脑工作', romanization: 'yòng diànnǎo gōngzuò', translation: 'work using a computer' }],
  usageNotes: ['电脑 is the usual general term for a computer.'],
  metadata: { schemaVersion: 1, source: 'cc-cedict', sourceVersion: '2026-01-01' },
}
