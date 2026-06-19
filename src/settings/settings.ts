import { LangCode } from '../languages';

type Provider = {
  name: string;
  requiresToken: boolean;
  requiresUrl: boolean;
  url: string | null;
  token: string | null;
  target: LangCode;
  language: LangCode;
};

export type Settings = {
  activeProviderId: string;
  providers: Record<string, Provider>;
};

export const DEFAULT_SETTINGS: Settings = {
  activeProviderId: 'google',
  providers: {
    ['google']: {
      name: 'Google Translate',
      requiresToken: false,
      requiresUrl: false,
      url: null,
      token: null,
      target: LangCode.English,
      language: LangCode.English,
    },
    ['deepl']: {
      name: 'DeepL',
      requiresToken: true,
      requiresUrl: false,
      url: null,
      token: null,
      target: LangCode.EnglishBritish,
      language: LangCode.English,
    },
    ['libretranslate']: {
      name: 'LibreTranslate',
      requiresToken: false,
      requiresUrl: true,
      url: null,
      token: null,
      target: LangCode.English,
      language: LangCode.English,
    },
  },
};

export const getActiveProvider = (settings: Settings) => {
  return settings.providers[settings.activeProviderId];
};

export const loadSettings = async (): Promise<Settings> => {
  const { settings } = await browser.storage.local.get('settings');

  if (!settings) {
    return DEFAULT_SETTINGS;
  }

  // merge in case of settings migration
  return {
    ...DEFAULT_SETTINGS,
    ...settings,
    providers: {
      ...DEFAULT_SETTINGS.providers,
      ...(settings.providers ?? {}),
    },
  };
};

export const subscribeSettings = (callback: (settings: Settings) => void) => {
  browser.storage.onChanged.addListener(async (changes) => {
    if (changes.settings) {
      callback(await loadSettings());
    }
  });
};

export const saveSettings = async (settings: Settings): Promise<void> => {
  await browser.storage.local.set({ settings });
};

export const resetSettings = async (): Promise<void> => {
  await browser.storage.local.set({ settings: DEFAULT_SETTINGS });
};
