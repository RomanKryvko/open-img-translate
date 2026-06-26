import SettingsPopup from './SettingsPopup.svelte';
import { hydrate } from 'svelte';
import { settings } from './settingsStore';

settings.init();

hydrate(SettingsPopup, {
  target: document.getElementById('settings-popup')!,
});
