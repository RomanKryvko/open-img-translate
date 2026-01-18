import Settings from './Settings.svelte';
import { hydrate } from 'svelte';

hydrate(Settings, {
  target: document.getElementById('app'),
});
