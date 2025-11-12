import * as Tesseract from 'tesseract.js';

export async function runOCR(element: Element | string, langs?: string): Promise<string> {
  if (element instanceof HTMLImageElement || typeof element === "string") {
    const result = await Tesseract.recognize(element, langs);
    return result.data.text;
  }
  throw new Error("Target is not an image element");
}
