import { LangCode } from './languages';
import type { TranslationResult, Translator } from './translator'

const getLanguageCodeString = (lang: LangCode): string => GOOGLE_LANG_KEYS[lang] || 'en'; // default to en in case of invalid target

const GOOGLE_LANG_KEYS: Partial<Record<LangCode, string>> = {
  [LangCode.Auto]: 'auto',
  [LangCode.Afrikaans]: 'af',
  [LangCode.Albanian]: 'sq',
  [LangCode.Arabic]: 'ar',
  [LangCode.Azerbaijani]: 'az',
  [LangCode.Belarusian]: 'be',
  [LangCode.Bengali]: 'bn',
  [LangCode.Bosnian]: 'bs',
  [LangCode.Bulgarian]: 'bg',
  [LangCode.Burmese]: 'my',
  [LangCode.Catalan]: 'ca',
  [LangCode.ChineseSimplified]: 'zh-CN',
  [LangCode.ChineseTraditional]: 'zh-TW',
  [LangCode.Croatian]: 'hr',
  [LangCode.Czech]: 'cs',
  [LangCode.Danish]: 'da',
  [LangCode.Dutch]: 'nl',
  [LangCode.English]: 'en',
  [LangCode.Estonian]: 'et',
  [LangCode.Filipino]: 'fil',
  [LangCode.Finnish]: 'fi',
  [LangCode.French]: 'fr',
  [LangCode.FrenchCanadian]: 'fr-CA',
  [LangCode.Frisian]: 'fy',
  [LangCode.Galician]: 'gl',
  [LangCode.Georgian]: 'ka',
  [LangCode.German]: 'de',
  [LangCode.Greek]: 'el',
  [LangCode.Guarani]: 'gn',
  [LangCode.Gujarati]: 'gu',
  [LangCode.Hebrew]: 'he',
  [LangCode.Hindi]: 'hi',
  [LangCode.Hungarian]: 'hu',
  [LangCode.Icelandic]: 'is',
  [LangCode.Indonesian]: 'id',
  [LangCode.Italian]: 'it',
  [LangCode.Japanese]: 'ja',
  [LangCode.Kannada]: 'kn',
  [LangCode.Khmer]: 'km',
  [LangCode.Korean]: 'ko',
  [LangCode.Kyrgyz]: 'ky',
  [LangCode.Lao]: 'lo',
  [LangCode.Latvian]: 'lv',
  [LangCode.Lingala]: 'ln',
  [LangCode.Lithuanian]: 'lt',
  [LangCode.Macedonian]: 'mk',
  [LangCode.Malay]: 'ms',
  [LangCode.Malayalam]: 'ml',
  [LangCode.Marathi]: 'mr',
  [LangCode.Nepali]: 'ne',
  [LangCode.Norwegian]: 'no',
  [LangCode.Persian]: 'fa',
  [LangCode.Polish]: 'pl',
  [LangCode.Portuguese]: 'pt',
  [LangCode.PortugueseBrazil]: 'pt-BR',
  [LangCode.PortuguesePortugal]: 'pt-PT',
  [LangCode.Punjabi]: 'pa',
  [LangCode.Romanian]: 'ro',
  [LangCode.Russian]: 'ru',
  [LangCode.Slovak]: 'sk',
  [LangCode.Slovenian]: 'sl',
  [LangCode.Spanish]: 'es',
  [LangCode.Swahili]: 'sw',
  [LangCode.Swedish]: 'sv',
  [LangCode.Tamil]: 'ta',
  [LangCode.Telugu]: 'te',
  [LangCode.Thai]: 'th',
  [LangCode.Turkish]: 'tr',
  [LangCode.Ukrainian]: 'uk',
  [LangCode.Urdu]: 'ur',
  [LangCode.Uzbek]: 'uz',
  [LangCode.Vietnamese]: 'vi',
  [LangCode.Welsh]: 'cy',
  [LangCode.Zulu]: 'zu',
};

const GOOGLE_LANGUAGE_SET = new Set<LangCode>(
  Object.keys(GOOGLE_LANG_KEYS) as LangCode[]
);

const GoogleTranslator: Translator = {
  //NOTE: we are assuming that google's translation api is symmetric
  supported: {
    source: GOOGLE_LANGUAGE_SET,
    target: GOOGLE_LANGUAGE_SET,
  },
  translate: async (
    text: string,
    src: LangCode | 'auto',
    target: LangCode,
  ): Promise<TranslationResult> => {
    const srcLang = src === 'auto' ? src : getLanguageCodeString(src);
    const targetLang = getLanguageCodeString(target);
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
  },
};

export default GoogleTranslator;
