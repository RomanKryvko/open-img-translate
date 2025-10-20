import * as Tesseract from 'tesseract.js';

function onCreated(): void {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log("Item created successfully");
  }
}

browser.menus.create({
  id: "translate-selection",
  title: browser.i18n.getMessage("translateImage"),
  contexts: ["selection"]
}, onCreated);

browser.menus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "translate-selection") {
    const element = browser.menus.getTargetElement(info.targetElementId || -1);
    if (element === undefined) {
      console.error("Couldn't get element from info.");
      return;
    }
    try {
      const res = await runOCR(element);
      console.log(res);
      const result = await translate(res);
      if (tab != undefined && tab.id != undefined)
        browser.tabs.sendMessage(tab.id, {
          type: "showTranslationPopup",
          text: info.selectionText,
          result,
        });
    } catch (e) {
      console.error(e);
    }
  }
});

async function translate(str?: string) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&dt=bd&dj=1&q=${encodeURIComponent(str || '')}`;
  const resp = await fetch(url);
  console.log(resp);
  const json = await resp.json();
  console.log(json);
  console.log(`Detected source language: ${json.src}`);
  console.log(`Translation: ${json.sentences[0].trans}`);
  return {
    src: json.src,
    trans: json.sentences.map((s: any) => s.trans).join(" "),
  };
}

async function runOCR(element: Element): Promise<string> {
  if (element instanceof HTMLImageElement) {
    const result = await Tesseract.recognize(element);
    return result.data.text;
  }
  throw new Error("Target is not an image element");
}
