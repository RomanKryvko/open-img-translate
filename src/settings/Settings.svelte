<script lang="ts">
  import GoogleTranslator from '../google';
  import { LangCode } from '../languages';
  import { OCR_LANGS } from '../ocr';
  import LanguageSelect from '../popup/LanguageSelect.svelte';
  import ProviderButton from './ProviderButton.svelte';
  import { settings } from './settingsStore';

  const getSupportedTargets = (provider: string): Set<LangCode> => {
    //FIXME: use provider variable when other providers are implemented
    return GoogleTranslator.supported.target;
  };

  const providers = [
    { value: 'google', name: 'Google' },
    { value: 'deepl', name: 'DeepL' },
    { value: 'libretranslate', name: 'LibreTranslate' },
  ];
</script>

<h1>Open Image Translate Settings</h1>

<label>
  Translation backend
  {#each providers as p}
    <ProviderButton value={p.value} label={p.name} checked={p.value === $settings.provider.name} />
  {/each}
</label>

{#if $settings.provider.name === 'deepl'}
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
{/if}

{#if $settings.provider.name === 'libretranslate'}
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
{/if}

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
