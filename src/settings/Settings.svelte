<script lang="ts">
  import { LangCode } from '../languages';
  import { OCR_LANGS } from '../ocr';
  import LanguageSelect from '../popup/LanguageSelect.svelte';
  import { getTranslatorById } from '../translatorConfig';
  import ProviderButton from './ProviderButton.svelte';
  import { getActiveProvider } from './settings';
  import { settings } from './settingsStore';

  const getCurrentTarget = (): LangCode => $settings.providers[$settings.activeProviderId].target;

  const getCurrentLanguage = (): LangCode =>
    $settings.providers[$settings.activeProviderId].language;

  const getSupportedTargets = (provider: string): Set<LangCode> => {
    return getTranslatorById(provider).supported.target;
  };

  const updateCurrentProviderProperty = (property: string, value: any) => {
    const id = $settings.activeProviderId;
    settings.update({
      providers: {
        ...$settings.providers,
        [id]: {
          ...$settings.providers[id],
          [property]: value,
        },
      },
    });
  };

  const updateSettingsToken = (token: string) => {
    updateCurrentProviderProperty('token', token);
  };

  const updateSettingsUrl = (url: string) => {
    updateCurrentProviderProperty('url', url);
  };

  const updateSettingsTarget = (target: LangCode) => {
    updateCurrentProviderProperty('target', target);
  };

  const updateSettingsLanguage = (language: LangCode) => {
    updateCurrentProviderProperty('language', language);
  };
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
        oninput={(e) => updateSettingsToken((e.target as HTMLInputElement).value)}
      />
    </label>
  {/if}

  {#if getActiveProvider($settings).requiresUrl}
    <label>
      {getActiveProvider($settings).name} URL
      <input
        type="url"
        value={getActiveProvider($settings).url ?? ''}
        oninput={(e) => updateSettingsUrl((e.target as HTMLInputElement).value)}
      />
    </label>
  {/if}
</div>

<LanguageSelect
  title={'Translation target language'}
  defaultValue={getCurrentTarget()}
  options={getSupportedTargets($settings.activeProviderId)}
  callback={(target) => updateSettingsTarget(target)}
/>

<LanguageSelect
  title={'Text recognition language'}
  defaultValue={getCurrentLanguage()}
  options={OCR_LANGS}
  callback={(language) => updateSettingsLanguage(language)}
/>

<style>
  .provider {
    display: flex;
    flex-direction: column;
  }
</style>
