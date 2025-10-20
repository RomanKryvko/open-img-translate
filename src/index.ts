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

browser.menus.onClicked.addListener((info) => {
  switch (info.menuItemId) {
    case "translate-selection":
      console.log(`Translating "${info.selectionText}"...`)
      translate(info.selectionText);
      break;
  }
});

async function translate(str?: string): Promise<void> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&dt=bd&dj=1&q=${encodeURIComponent(str || '')}`;
  const resp = await fetch(url);
  console.log(resp);
  const json = await resp.json();
  console.log(json);
  console.log(`Detected source language: ${json.src}`);
  console.log(`Translation: ${json.sentences[0].trans}`);
}
