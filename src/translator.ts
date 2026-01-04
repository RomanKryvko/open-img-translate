import { Lang, LangCode, LanguageList } from './languages.ts';

export interface TranslationResult {
  src: string; // Detected source language
  result: string; // Translation result
}

export interface Translator {
  supportedLangs: LanguageList;
  translate: (
    src: LangCode | undefined,
    target: LangCode,
    text: string,
  ) => Promise<TranslationResult>;
}

export class GoogleTranslator implements Translator {
  supportedLangs: LanguageList = {};
  translate = async (
    src: LangCode | undefined,
    target: LangCode,
    text: string,
  ): Promise<TranslationResult> => {
    const srcLang = src === undefined ? 'auto' : this.supportedLangs[src];
    const targetLang = this.supportedLangs[target];

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${srcLang}&tl=${targetLang}&dt=t&dt=bd&dj=1&q=${encodeURIComponent(text)}`;
    const resp = await fetch(url);
    console.log(resp);
    const json = await resp.json();
    console.log(json);
    console.log(`Detected source language: ${json.src}`);
    return {
      src: json.src,
      result: json.sentences.map((s: any) => s.trans).join(' '),
    };
  };
}
