import { showPopup, showTranslationWindowPopup } from './popup/showPopup';
import { runOCR, OCR_LANGS } from './ocr';
import { EventMap } from './eventmap';
import { getLanguage, getTarget, getTranslator } from './translatorConfig';

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
  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position: 'fixed',
    inset: '0',
    backgroundColor: 'rgba(0,0,0,0.3)',
    cursor: 'crosshair',
    zIndex: '999999',
  });
  document.body.appendChild(overlay);

  let startX = 0,
    startY = 0,
    box: HTMLDivElement | null = null;

  const onMouseDown = (e: MouseEvent) => {
    startX = e.clientX;
    startY = e.clientY;
    box = document.createElement('div');
    Object.assign(box.style, {
      position: 'fixed',
      border: '2px solid #00ffff',
      backgroundColor: 'rgba(0,255,255,0.1)',
      left: `${startX}px`,
      top: `${startY}px`,
      zIndex: '1000000',
    });
    document.body.appendChild(box);
    window.addEventListener('mousemove', onMouseMove);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!box) return;
    const x = Math.min(e.clientX, startX);
    const y = Math.min(e.clientY, startY);
    const w = Math.abs(e.clientX - startX);
    const h = Math.abs(e.clientY - startY);
    Object.assign(box.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` });
  };

  const onMouseUp = (_e: MouseEvent) => {
    if (!box) return;
    overlay.remove();
    window.removeEventListener('mousedown', onMouseDown);
    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('mousemove', onMouseMove);

    const rect = box.getBoundingClientRect();
    box.remove();
    captureRegion(rect);
  };

  window.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);
};

const captureRegion = async (rect: DOMRect) => {
  const { left, top, width, height } = rect;
  const imageUri = await browser.runtime.sendMessage({
    type: 'captureRegion',
    rect: { left, top, width, height },
  });
  console.log('Captured region:', imageUri);
};

const events: EventMap = {
  translateElement: translateElement,
  startAreaSelection: startAreaSelection,
  translateArea: translateArea,
};

browser.runtime.onMessage.addListener(async (message) => {
  events[message.type](message);
});
