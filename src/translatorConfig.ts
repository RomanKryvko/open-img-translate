import { Settings, loadSettings, subscribeSettings } from './settings/settings';
import type { Translator } from './translator';
import { LangCode } from './languages';
import GoogleTranslator from './google';
import DeepLTranslator from './deepl';

const translatorRegistry: Record<string, Translator> = {
  google: GoogleTranslator,
  deepl: DeepLTranslator,
};

let translator: Translator;
let target: LangCode;
let language: LangCode;
let token: string | null;
let url: string | null;

const sync = (settings: Settings) => {
  translator = translatorRegistry[settings.provider.name];
  target = settings.target;
  language = settings.language;
  token = settings.provider.token;
  url = settings.provider.url;
};

loadSettings().then((settings) => sync(settings));
subscribeSettings((settings) => sync(settings));

export const getTranslator = (): Translator => translator;
export const getTranslatorById = (id: string): Translator => translatorRegistry[id];
export const getTarget = (): LangCode => target;
export const getLanguage = (): LangCode => language;
export const getApiToken = (): string | null => token;
export const getUrl = (): string | null => url;
