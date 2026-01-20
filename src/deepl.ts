import { LangCode } from './languages';
import { TranslationResult, Translator } from './translator';
import { loadSettings, subscribeSettings } from './settings/settings';

let apiKey: string | null;
loadSettings().then((settings) => (apiKey = settings.provider.token));
subscribeSettings((settings) => (apiKey = settings.provider.token));

const getLanguageCodeString = (lang: LangCode, record: Partial<Record<LangCode, string>>): string =>
  record[lang] || 'EN'; // default to en in case of invalid target

const isFreeAccount = (authKey: string): boolean => authKey.endsWith(':fx');

const DEEPL_SOURCE_KEYS: Partial<Record<LangCode, string>> = {
  [LangCode.Arabic]: 'AR',
  [LangCode.Bulgarian]: 'BG',
  [LangCode.Czech]: 'CS',
  [LangCode.Danish]: 'DA',
  [LangCode.German]: 'DE',
  [LangCode.Greek]: 'EL',
  [LangCode.English]: 'EN',
  [LangCode.Spanish]: 'ES',
  [LangCode.Estonian]: 'ET',
  [LangCode.Finnish]: 'FI',
  [LangCode.French]: 'FR',
  [LangCode.Hebrew]: 'HE',
  [LangCode.Hungarian]: 'HU',
  [LangCode.Indonesian]: 'ID',
  [LangCode.Italian]: 'IT',
  [LangCode.Japanese]: 'JA',
  [LangCode.Korean]: 'KO',
  [LangCode.Lithuanian]: 'LT',
  [LangCode.Latvian]: 'LV',
  [LangCode.Norwegian]: 'NB',
  [LangCode.Dutch]: 'NL',
  [LangCode.Polish]: 'PL',
  [LangCode.Portuguese]: 'PT',
  [LangCode.Romanian]: 'RO',
  [LangCode.Russian]: 'RU',
  [LangCode.Slovak]: 'SK',
  [LangCode.Slovenian]: 'SL',
  [LangCode.Swedish]: 'SV',
  [LangCode.Thai]: 'TH',
  [LangCode.Turkish]: 'TR',
  [LangCode.Ukrainian]: 'UK',
  [LangCode.Vietnamese]: 'VI',
  [LangCode.Chinese]: 'ZH',
};

const DEEPL_TARGET_KEYS: Partial<Record<LangCode, string>> = {
  [LangCode.Arabic]: 'AR',
  [LangCode.Bulgarian]: 'BG',
  [LangCode.Czech]: 'CS',
  [LangCode.Danish]: 'DA',
  [LangCode.German]: 'DE',
  [LangCode.Greek]: 'EL',
  [LangCode.EnglishBritish]: 'EN-GB',
  [LangCode.EnglishAmerican]: 'EN-US',
  [LangCode.Spanish]: 'ES',
  [LangCode.SpanishLatinAmerican]: 'ES-419',
  [LangCode.Estonian]: 'ET',
  [LangCode.Finnish]: 'FI',
  [LangCode.French]: 'FR',
  [LangCode.Hebrew]: 'HE',
  [LangCode.Hungarian]: 'HU',
  [LangCode.Indonesian]: 'ID',
  [LangCode.Italian]: 'IT',
  [LangCode.Japanese]: 'JA',
  [LangCode.Korean]: 'KO',
  [LangCode.Lithuanian]: 'LT',
  [LangCode.Latvian]: 'LV',
  [LangCode.Norwegian]: 'NB',
  [LangCode.Dutch]: 'NL',
  [LangCode.Polish]: 'PL',
  [LangCode.PortugueseBrazil]: 'PT-BR',
  [LangCode.PortuguesePortugal]: 'PT-PT',
  [LangCode.Romanian]: 'RO',
  [LangCode.Russian]: 'RU',
  [LangCode.Slovak]: 'SK',
  [LangCode.Slovenian]: 'SL',
  [LangCode.Swedish]: 'SV',
  [LangCode.Thai]: 'TH',
  [LangCode.Turkish]: 'TR',
  [LangCode.Ukrainian]: 'UK',
  [LangCode.Vietnamese]: 'VI',
  [LangCode.Chinese]: 'ZH',
  [LangCode.ChineseSimplified]: 'ZH-HANS',
  [LangCode.ChineseTraditional]: 'ZH-HANT',
};

const languageRecordToSet = (record: Partial<Record<LangCode, string>>): Set<LangCode> =>
  new Set<LangCode>(Object.keys(record) as LangCode[]);

const DEEPL_SOURCE_SET = languageRecordToSet(DEEPL_SOURCE_KEYS);
const DEEPL_TARGET_SET = languageRecordToSet(DEEPL_TARGET_KEYS);

class DeepLTranslator implements Translator {
  supported = { source: DEEPL_SOURCE_SET, target: DEEPL_TARGET_SET };
  translate = async (
    text: string,
    src: LangCode | 'auto',
    target: LangCode,
  ): Promise<TranslationResult> => {
    if (!apiKey) {
      throw new Error('DeepL API key not set');
    }
    const targetLang = getLanguageCodeString(target, DEEPL_TARGET_KEYS);
    const url = `https://api${isFreeAccount(apiKey) ? '-free' : ''}.deepl.com/v2/translate`;
    const data: any = {
      text: [text],
      target_lang: targetLang,
      ...(src != 'auto' && { source_lang: getLanguageCodeString(src, DEEPL_SOURCE_KEYS) }),
    };

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `DeepL-Auth-Key ${apiKey}`,
      },
      body: JSON.stringify(data),
    });
    console.log(resp);
    const json = await resp.json();
    const detectedSrc = json.translations[0].detected_source_language;
    console.log(`Detected source language: ${detectedSrc}`);
    return {
      src: detectedSrc,
      result: json.translations.map((s: any) => s.text).join(' '),
    };
  };
}

const DeepLTranslatorImpl = new DeepLTranslator();
export default DeepLTranslatorImpl;
