import { writable } from 'svelte/store';
import { Settings, loadSettings, saveSettings, DEFAULT_SETTINGS } from './settings';
import { LangCode } from '../languages';

const createSettingsStore = () => {
  const { subscribe, set, update } = writable<Settings>(DEFAULT_SETTINGS);

  return {
    subscribe,

    async init() {
      const settings = await loadSettings();
      set(settings);
    },

    async update(patch: Partial<Settings>) {
      update((current) => {
        const next = { ...current, ...patch };
        saveSettings(next);
        return next;
      });
    },

    updateCurrentProviderProperty(property: keyof Settings['providers'][string], value: any) {
      update((current) => {
        const id = current.activeProviderId;

        const next = {
          ...current,
          providers: {
            ...current.providers,
            [id]: {
              ...current.providers[id],
              [property]: value,
            },
          },
        };

        saveSettings(next);
        return next;
      });
    },

    updateToken(token: string) {
      this.updateCurrentProviderProperty('token', token);
    },

    updateUrl(url: string) {
      this.updateCurrentProviderProperty('url', url);
    },

    updateTarget(target: LangCode) {
      this.updateCurrentProviderProperty('target', target);
    },

    updateLanguage(language: LangCode) {
      this.updateCurrentProviderProperty('language', language);
    },
  };
};

export const settings = createSettingsStore();
