import * as Tesseract from 'tesseract.js';

browser.runtime.onMessage.addListener(async (message) => {
  if (message.type === "translateElement") {
    const element = browser.menus.getTargetElement(message.targetElementId);
    if (element == undefined) {
      console.error("Couldn't get element from info.");
      return;
    }
    try {
      showPopup("Recognising text...", 1000);
      const recognisedText = await runOCR(element);
      console.log(`OCR result: ${recognisedText}`);
      showPopup("Translating...", 1000);
      const transResult = await browser.runtime.sendMessage({ type: "translateText", text: recognisedText });
      showPopup(transResult.trans, 5000);
    } catch (e) {
      console.error(e);
    }
  }
});

function showPopup(message: string, timeoutMs: number): void {
  const existing = document.getElementById("translator-popup");
  if (existing) existing.remove();

  const popup = document.createElement("div");
  popup.id = "translator-popup";
  popup.classList.add("translator-popup");
  popup.textContent = message;
  document.body.appendChild(popup);

  setTimeout(() => popup.remove(), timeoutMs);
}

async function runOCR(element: Element): Promise<string> {
  if (element instanceof HTMLImageElement) {
    const result = await Tesseract.recognize(element);
    return result.data.text;
  }
  throw new Error("Target is not an image element");
}
