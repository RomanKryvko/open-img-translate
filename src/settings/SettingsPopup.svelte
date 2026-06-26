<script lang="ts">
  import { getActiveProvider } from './settings';
  import { settings } from './settingsStore';
  import LanguageSelectSettings from './LanguageSelectSettings.svelte';

  const goToSettingsPage = () => {
    browser.tabs.create({ url: browser.runtime.getURL('/options.html') });
  };
</script>

<h1>Open Image Translate Settings</h1>
<button style="float: right;" onclick={goToSettingsPage}>Settings</button>
<p>Current backend: <b>{getActiveProvider($settings).name}</b></p>
<LanguageSelectSettings />

<style>
</style>
