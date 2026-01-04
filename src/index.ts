import type { EventMap } from './eventmap';

const events: EventMap = {
  captureRegion: capture,
  translateText: translateMessage,
};

browser.runtime.onMessage.addListener(async (message, sender) => {
  return events[message.type](message, sender);
});

function onCreated(): void {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log('Item created successfully');
  }
}

browser.menus.create(
  {
    id: 'translate-selection',
    title: browser.i18n.getMessage('translateImage'),
    contexts: ['image'],
  },
  onCreated,
);

browser.menus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'translate-selection' && tab?.id) {
    browser.tabs.sendMessage(tab.id, {
      type: 'translateElement',
      targetElementId: info.targetElementId,
    });
  } else if (info.menuItemId === 'select-area-ocr' && tab?.id) {
    browser.tabs.sendMessage(tab.id, { type: 'startAreaSelection' });
  }
});

browser.menus.create(
  {
    id: 'select-area-ocr',
    title: 'Translate selected area',
    contexts: ['page'],
  },
  onCreated,
);

async function capture(message: any, sender?: browser.runtime.MessageSender): Promise<string> {
  const { rect } = message;
  const dataUrl = await browser.tabs.captureVisibleTab({ format: 'png' });
  const cropped = await cropDataUrl(dataUrl, rect);
  if (sender?.tab?.id) {
    browser.tabs.sendMessage(sender.tab.id, {
      type: 'translateArea',
      text: cropped,
    });
  }
  return cropped;
}

async function translateMessage(message: any): Promise<{ src: string; trans: string }> {
  return await translate(message.text, message.target);
}

async function cropDataUrl(
  dataUrl: string,
  rect: { left: number; top: number; width: number; height: number },
) {
  const img = await createImageBitmap(await (await fetch(dataUrl)).blob());
  const canvas = new OffscreenCanvas(rect.width, rect.height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, rect.left, rect.top, rect.width, rect.height, 0, 0, rect.width, rect.height);
  return canvas.convertToBlob().then(async (blob) => {
    const arr = await blob.arrayBuffer();
    return `data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(arr)))}`;
  });
}

//TODO: call the default translator interface here
async function translate(str?: string, target?: string) {
  target = target || 'en';
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&dt=bd&dj=1&q=${encodeURIComponent(str || '')}`;
  const resp = await fetch(url);
  console.log(resp);
  const json = await resp.json();
  console.log(json);
  console.log(`Detected source language: ${json.src}`);
  console.log(`Translation: ${json.sentences[0].trans}`);
  return {
    src: json.src,
    trans: json.sentences.map((s: any) => s.trans).join(' '),
  };
}
