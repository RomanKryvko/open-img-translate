<script lang="ts">
  import { getActiveProvider } from './settings';
  import { settings } from './settingsStore';
  import LanguageSelectSettings from './LanguageSelectSettings.svelte';

  const goToSettingsPage = () => {
    browser.tabs.create({ url: browser.runtime.getURL('/options.html') });
  };
</script>

<h1 class="settings-header">Open Image Translate</h1>
<button class="settings-icon" onclick={goToSettingsPage} title="Go to settings"
  ><img src="/assets/cogwheel.svg" alt="Settings button" /></button
>
<p>Current backend: <b>{getActiveProvider($settings).name}</b></p>
<LanguageSelectSettings layout="row" />

<style>
  .settings-header {
    font-size: 1.3em;
  }
  .settings-icon {
    float: right;
    background: transparent;
    height: 2em;
    display: flex;
    align-items: center;
    align-content: center;
    border: none;
  }
  .settings-icon img {
    height: inherit;
  }
  .settings-icon:hover {
    transform: rotate(90deg);
    transition: transform 1s;
  }
</style>
