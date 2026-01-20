import { LangCode } from '../languages';

export type Settings = {
  provider: {
    name: string;
    url: string | null;
    token: string | null;
  };
  target: LangCode;
  language: LangCode;
};

export const DEFAULT_SETTINGS: Settings = {
  provider: {
    name: 'google',
    url: null,
    token: null,
  },
  target: LangCode.English,
  language: LangCode.English,
};

export const loadSettings = async (): Promise<Settings> => {
  const { settings } = await browser.storage.local.get('settings');
  return settings ?? DEFAULT_SETTINGS;
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
