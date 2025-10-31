import * as Tesseract from 'tesseract.js';
import { showPopup, showTranslationPopup } from './popup/showPopup';

browser.runtime.onMessage.addListener(async (message) => {
  switch (message.type) {
    case ("translateElement"): {
      const element = browser.menus.getTargetElement(message.targetElementId);
      if (element == undefined) {
        console.error("Couldn't get element from info.");
        return;
      }
      try {
        const pos = getElementCenter(element)
        showPopup("Recognising text...", pos, 1000);
        const recognisedText = await runOCR(element);
        console.log(`OCR result: ${recognisedText}`);
        showPopup("Translating...", pos, 1000);
        const transResult = await browser.runtime.sendMessage({ type: "translateText", text: recognisedText });
        showTranslationPopup(transResult.trans, pos);
      } catch (e) {
        console.error(e);
      }
      break;
    }
    case ("startAreaSelection"): {
      startAreaSelection()
      break;
    }
    case ("translateArea"): {
      try {
        const pos = getWindowCenter();
        showPopup("Recognising text...", pos, 1000);
        const recognisedText = await runOCR(message.text);
        console.log(`OCR result: ${recognisedText}`);
        showPopup("Translating...", pos, 1000);
        const transResult = await browser.runtime.sendMessage({ type: "translateText", text: recognisedText });
        showTranslationPopup(transResult.trans, pos);
      } catch (e) {
        console.error(e);
      }
      break;
    }
  }
});

interface Position {
  x: number;
  y: number;
}

function getWindowCenter(): Position {
  return {
    x: window.scrollX + window.innerWidth / 2,
    y: window.scrollY + window.innerHeight / 2
  };
}

function getElementCenter(element: Element): Position {
  const rect = element.getBoundingClientRect();
  return {
    x: window.scrollX + rect.left + rect.width / 2,
    y: window.scrollY + rect.top + rect.height / 2
  };
}

function startAreaSelection() {
  const overlay = document.createElement("div");
  Object.assign(overlay.style, {
    position: "fixed",
    inset: "0",
    backgroundColor: "rgba(0,0,0,0.3)",
    cursor: "crosshair",
    zIndex: "999999",
  });
  document.body.appendChild(overlay);

  let startX = 0, startY = 0, box: HTMLDivElement | null = null;

  function onMouseDown(e: MouseEvent) {
    startX = e.clientX;
    startY = e.clientY;
    box = document.createElement("div");
    Object.assign(box.style, {
      position: "fixed",
      border: "2px solid #00ffff",
      backgroundColor: "rgba(0,255,255,0.1)",
      left: `${startX}px`,
      top: `${startY}px`,
      zIndex: "1000000",
    });
    document.body.appendChild(box);
    window.addEventListener("mousemove", onMouseMove);
  }

  function onMouseMove(e: MouseEvent) {
    if (!box) return;
    const x = Math.min(e.clientX, startX);
    const y = Math.min(e.clientY, startY);
    const w = Math.abs(e.clientX - startX);
    const h = Math.abs(e.clientY - startY);
    Object.assign(box.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` });
  }

  function onMouseUp(e: MouseEvent) {
    if (!box) return;
    overlay.remove();
    window.removeEventListener("mousedown", onMouseDown);
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("mousemove", onMouseMove);

    const rect = box.getBoundingClientRect();
    box.remove();
    captureRegion(rect);
  }

  window.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mouseup", onMouseUp);
}

async function captureRegion(rect: DOMRect) {
  const { left, top, width, height } = rect;
  const imageUri = await browser.runtime.sendMessage({
    type: "captureRegion",
    rect: { left, top, width, height },
  });
  console.log("Captured region:", imageUri);
}

async function runOCR(element: Element | string): Promise<string> {
  if (element instanceof HTMLImageElement || typeof element === "string") {
    const result = await Tesseract.recognize(element);
    return result.data.text;
  }
  throw new Error("Target is not an image element");
}
