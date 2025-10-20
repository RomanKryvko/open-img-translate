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
  contexts: ["selection"] //TODO: replace with 'image' when the image translation is ready
}, onCreated);

browser.menus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "translate-selection") {
    const result = await translate(info.selectionText);
    if (tab != undefined && tab.id != undefined)
      browser.tabs.sendMessage(tab.id, {
        type: "showTranslationPopup",
        text: info.selectionText,
        result,
      });
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
