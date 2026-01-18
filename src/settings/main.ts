import Settings from './Settings.svelte';
import { hydrate } from 'svelte';
import { settings } from './settingsStore';

settings.init();

hydrate(Settings, {
  target: document.getElementById('app'),
});
