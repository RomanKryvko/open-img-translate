<script lang="ts">
  import DeepLTranslator from '../deepl';
  import GoogleTranslator from '../google';
  import { LangCode } from '../languages';
  import { OCR_LANGS } from '../ocr';
  import LanguageSelect from '../popup/LanguageSelect.svelte';
  import ProviderButton from './ProviderButton.svelte';
  import { settings } from './settingsStore';

  const getSupportedTargets = (provider: string): Set<LangCode> => {
    return providers.find((p) => p.value == provider)?.instance.supported.target!;
  };

  const providers = [
    { value: 'google', name: 'Google', instance: GoogleTranslator },
    { value: 'deepl', name: 'DeepL', instance: DeepLTranslator },
    //FIXME: change to LibreTranslate instance once it's implemented
    { value: 'libretranslate', name: 'LibreTranslate', instance: GoogleTranslator },
  ];
</script>

<h1>Open Image Translate Settings</h1>

<h2>Translation backend</h2>
<div class="provider">
  {#each providers as p}
    <ProviderButton value={p.value} label={p.name} checked={p.value === $settings.provider.name} />
  {/each}

  {#if $settings.provider.name === 'deepl'}
    <label>
      DeepL API token
      <input
        type="password"
        value={$settings.provider.token ?? ''}
        oninput={(e) =>
          settings.update({
            provider: {
              ...$settings.provider,
              token: (e.target as HTMLInputElement).value,
            },
          })}
      />
    </label>
  {/if}

  {#if $settings.provider.name === 'libretranslate'}
    <label>
      LibreTranslate instance URL
      <input
        type="url"
        value={$settings.provider.url ?? ''}
        oninput={(e) =>
          settings.update({
            provider: {
              ...$settings.provider,
              url: (e.target as HTMLInputElement).value,
            },
          })}
      />
    </label>
  {/if}
</div>

<LanguageSelect
  title={'Translation target language'}
  defaultValue={$settings.target}
  options={getSupportedTargets($settings.provider.name)}
  callback={(target) => settings.update({ target })}
/>

<LanguageSelect
  title={'Text recognition language'}
  defaultValue={$settings.language}
  options={OCR_LANGS}
  callback={(language) => settings.update({ language })}
/>

<style>
  .provider {
    display: flex;
    flex-direction: column;
  }
</style>
