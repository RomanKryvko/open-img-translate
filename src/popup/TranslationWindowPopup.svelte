<script lang="ts">
  import { runOCR } from "../ocr";
  import HideableOnClick from "./HideableOnClick.svelte";
  import LanguageSelect from "./LanguageSelect.svelte";

  const {
    pos,
    srcLang,
    targetLang,
    languageOptions,
    image,
    initialMessage,
  }: {
    pos: { x: number; y: number };
    srcLang: { key: string; text: string };
    targetLang: { key: string; text: string };
    languageOptions: { key: string; text: string }[];
    image: Element | string;
    initialMessage: string;
  } = $props();

  let message = $state(initialMessage);

  async function rerunTranslation(text: string) {
    message = (
      await browser.runtime.sendMessage({
        type: "translateText",
        text,
      })
    ).trans;
  }
</script>

<HideableOnClick>
  <div
    style="left:{pos.x}px; top:{pos.y}px;"
    class="translator-popup translator-window"
  >
    <div class="language-menu">
      <!-- TODO: use i18n strings here-->
      <LanguageSelect
        title={"From"}
        callback={async (selectedSrc) => {
          const recognised = await runOCR(image, selectedSrc?.key);
          rerunTranslation(recognised);
        }}
        options={languageOptions}
        defaultValue={srcLang}
      />
      <LanguageSelect
        title={"To"}
        callback={async (_selectedSrc) => {
          rerunTranslation(message);
        }}
        options={languageOptions}
        defaultValue={targetLang}
      />
    </div>
    <div class="translator-textarea-wrapper">
      <textarea readonly={true} class="translator-textarea">{message}</textarea>
    </div>
  </div>
</HideableOnClick>
