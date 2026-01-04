import { LangCode } from './languages';

export interface TranslationResult {
  src: string; // Detected source language
  result: string; // Translation result
}

export interface Translator {
  supported: {
    source: Set<LangCode | 'auto'>;
    target: Set<LangCode>;
  };
  translate: (text: string, src: LangCode | 'auto', target: LangCode) => Promise<TranslationResult>;
}
