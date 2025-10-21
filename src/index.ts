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
  contexts: ["image"]
}, onCreated);

browser.menus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "translate-selection" && tab?.id) {
    browser.tabs.sendMessage(tab.id, {
      type: "translateElement",
      targetElementId: info.targetElementId,
    });
  }
});

browser.runtime.onMessage.addListener(async (message) => {
  if (message.type === "translateText") {
    const res = await translate(message.text);
    return res;
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

