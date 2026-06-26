<script lang="ts">
  import LanguageSelectSettings from './LanguageSelectSettings.svelte';
  import ProviderButton from './ProviderButton.svelte';
  import { getActiveProvider } from './settings';
  import { settings } from './settingsStore';
</script>

<h1>Open Image Translate Settings</h1>

<h2>Translation backend</h2>
<div class="provider">
  {#each Object.keys($settings.providers) as p}
    <ProviderButton
      value={p}
      label={$settings.providers[p].name}
      checked={$settings.activeProviderId === p}
    />
  {/each}

  {#if getActiveProvider($settings).requiresToken}
    <label>
      {getActiveProvider($settings).name} API token
      <input
        type="password"
        value={getActiveProvider($settings).token ?? ''}
        oninput={(e) => settings.updateToken((e.target as HTMLInputElement).value)}
      />
    </label>
  {/if}

  {#if getActiveProvider($settings).requiresUrl}
    <label>
      {getActiveProvider($settings).name} URL
      <input
        type="url"
        value={getActiveProvider($settings).url ?? ''}
        oninput={(e) => settings.updateUrl((e.target as HTMLInputElement).value)}
      />
    </label>
  {/if}
</div>

<LanguageSelectSettings />

<style>
  .provider {
    display: flex;
    flex-direction: column;
  }
</style>
