<script lang="ts">
  import GoogleTranslator from '../google';
  import { LangCode } from '../languages';
  import { OCR_LANGS } from '../ocr';
  import LanguageSelect from '../popup/LanguageSelect.svelte';
  import ProviderButton from './ProviderButton.svelte';
  import { settings } from './settingsStore';

  let provider = $state($settings.provider.name);
  const getSupportedTargets = (provider: string): Set<LangCode> => {
    //FIXME: use provider variable when other providers are implemented
    return GoogleTranslator.supported.target;
  };
</script>

<h1>Open Image Translate Settings</h1>

<label>
  Translation backend
  <ProviderButton bind:group={provider} value={'google'} label={'Google'} />
  <ProviderButton bind:group={provider} value={'deepl'} label={'DeepL'} />
  <ProviderButton bind:group={provider} value={'libretranslate'} label={'LibreTranslate'} />
</label>

{#if provider === 'deepl'}
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

{#if provider === 'libretranslate'}
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
  options={getSupportedTargets(provider)}
  callback={(target) => settings.update({ target })}
/>

<LanguageSelect
  title={'Text recognition language'}
  defaultValue={$settings.language}
  options={OCR_LANGS}
  callback={(language) => settings.update({ language })}
/>
