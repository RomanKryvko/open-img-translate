import type { EventMap } from './eventmap';
import { LangCode } from './languages';
import { getTranslator } from './translatorConfig';
import { TranslationResult } from './translator';

const onCreated = (): void => {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log('Item created successfully');
  }
};

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

const capture = async (message: any, sender?: browser.runtime.MessageSender): Promise<string> => {
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
};

const translateMessage = async (message: any): Promise<TranslationResult> => {
  const src = (message.src as LangCode) || 'auto';
  const target = (message.target as LangCode) || 'en';
  return await getTranslator().translate(message.text, src, target);
};

const cropDataUrl = async (
  dataUrl: string,
  rect: { left: number; top: number; width: number; height: number },
) => {
  const img = await createImageBitmap(await (await fetch(dataUrl)).blob());
  const canvas = new OffscreenCanvas(rect.width, rect.height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, rect.left, rect.top, rect.width, rect.height, 0, 0, rect.width, rect.height);
  return canvas.convertToBlob().then(async (blob) => {
    const arr = await blob.arrayBuffer();
    return `data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(arr)))}`;
  });
};

const events: EventMap = {
  captureRegion: capture,
  translateText: translateMessage,
};

browser.runtime.onMessage.addListener(async (message, sender) => {
  return events[message.type](message, sender);
});
