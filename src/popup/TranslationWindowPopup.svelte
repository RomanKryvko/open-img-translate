<script lang="ts">
  import { LangCode } from '../languages';
  import { runOCR } from '../ocr';
  import HideableOnClick from './HideableOnClick.svelte';
  import LanguageSelect from './LanguageSelect.svelte';

  const {
    pos,
    srcLang,
    targetLang,
    languageOptions,
    image,
    recognised,
    initialMessage,
  }: {
    pos: { x: number; y: number };
    srcLang: LangCode;
    targetLang: LangCode;
    languageOptions: {
      src: Set<LangCode | 'auto'>;
      target: Set<LangCode>;
    };
    image: Element | string;
    // NOTE: We save the recognised text separately from the displayed message to avoid
    // 'telephone game' when rerunning translation without rerunning OCR
    recognised: string;
    initialMessage: string;
  } = $props();

  let message = $state(initialMessage);
  let src = srcLang;
  let target = targetLang;

  const rerunTranslation = async (text: string) => {
    message = (
      await browser.runtime.sendMessage({
        type: 'translateText',
        text,
        src,
        target,
      })
    ).result;
  };
</script>

<HideableOnClick>
  <div style="left:{pos.x}px; top:{pos.y}px;" class="translator-popup translator-window">
    <div class="language-menu">
      <!-- TODO: use i18n strings here-->
      <LanguageSelect
        title={'From'}
        callback={async (selectedSrc) => {
          src = selectedSrc;
          rerunTranslation(await runOCR(image, selectedSrc));
        }}
        options={languageOptions.src}
        defaultValue={srcLang}
      />
      <LanguageSelect
        title={'To'}
        callback={async (selectedTarget) => {
          target = selectedTarget;
          rerunTranslation(recognised);
        }}
        options={languageOptions.target}
        defaultValue={targetLang}
      />
    </div>
    <div class="translator-textarea-wrapper">
      <textarea readonly={true} class="translator-textarea">{message}</textarea>
    </div>
  </div>
</HideableOnClick>
