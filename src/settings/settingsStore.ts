import { writable } from 'svelte/store';
import { Settings, loadSettings, saveSettings, DEFAULT_SETTINGS } from './settings';

function createSettingsStore() {
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
  };
}

export const settings = createSettingsStore();
