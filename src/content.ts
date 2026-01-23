import { showPopup, showTranslationWindowPopup } from './popup/showPopup';
import { runOCR, OCR_LANGS } from './ocr';
import { EventMap } from './eventmap';
import { getLanguage, getTarget, getTranslator } from './translatorConfig';
import { mount } from 'svelte';
import SelectionOverlay from './popup/SelectionOverlay.svelte';

const translateElement = async (message: any) => {
  const element = browser.menus.getTargetElement(message.targetElementId);
  if (element == undefined) {
    console.error("Couldn't get element from info.");
    return;
  }
  try {
    const pos = getElementCenter(element);
    translateAndShowPopup(element, pos);
  } catch (e) {
    console.error(e);
  }
};

const translateArea = async (message: any) => {
  try {
    const pos = getWindowCenter();
    translateAndShowPopup(message.text, pos);
  } catch (e) {
    console.error(e);
  }
};

const translateAndShowPopup = async (source: Element | string, pos: Position) => {
  showPopup('Recognising text...', pos, 1000);
  const recognised = await runOCR(source);
  console.log(`OCR result: ${recognised}`);
  showPopup('Translating...', pos, 1000);
  const translation = (
    await browser.runtime.sendMessage({
      type: 'translateText',
      text: recognised,
      target: getTarget(),
    })
  ).result;
  showTranslationWindowPopup(
    translation,
    pos,
    getLanguage(),
    getTarget(),
    { src: OCR_LANGS, target: getTranslator().supported.target },
    source,
    recognised,
  );
};

interface Position {
  x: number;
  y: number;
}

const getWindowCenter = (): Position => {
  return {
    x: window.scrollX + window.innerWidth / 2,
    y: window.scrollY + window.innerHeight / 2,
  };
};

const getElementCenter = (element: Element): Position => {
  const rect = element.getBoundingClientRect();
  return {
    x: window.scrollX + rect.left + rect.width / 2,
    y: window.scrollY + rect.top + rect.height / 2,
  };
};

const startAreaSelection = () => {
  mount(SelectionOverlay, { target: document.body });
};

const events: EventMap = {
  translateElement: translateElement,
  startAreaSelection: startAreaSelection,
  translateArea: translateArea,
};

browser.runtime.onMessage.addListener(async (message) => {
  events[message.type](message);
});
