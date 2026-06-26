<script lang="ts">
  import LanguageSelect from '../popup/LanguageSelect.svelte';
  import { OCR_LANGS } from '../ocr';
  import { LangCode } from '../languages';
  import { settings } from './settingsStore';
  import { getTranslatorById } from '../translatorConfig';

  const getCurrentTarget = (): LangCode => $settings.providers[$settings.activeProviderId].target;

  const getCurrentLanguage = (): LangCode =>
    $settings.providers[$settings.activeProviderId].language;

  const getSupportedTargets = (provider: string): Set<LangCode> => {
    return getTranslatorById(provider).supported.target;
  };
</script>

{#key $settings.activeProviderId}
  <LanguageSelect
    title={'Translation target language'}
    defaultValue={getCurrentTarget()}
    options={getSupportedTargets($settings.activeProviderId)}
    callback={(target) => settings.updateTarget(target)}
  />

  <LanguageSelect
    title={'Text recognition language'}
    defaultValue={getCurrentLanguage()}
    options={OCR_LANGS}
    callback={(language) => settings.updateLanguage(language)}
  />
{/key}
