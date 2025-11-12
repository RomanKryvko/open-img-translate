import Popup from './Popup.svelte'
import TranslationPopup from './TranslationPopup.svelte'
import TranslationWindowPopup from './TranslationWindowPopup.svelte'
import { mount } from 'svelte'

const createContainer = (): HTMLElement => {
  const existing = document.getElementById("translator-popup");
  if (existing) existing.remove();

  const container = document.createElement("div");
  container.id = "translator-popup";
  document.body.appendChild(container);
  return container;
}

export const showPopup = (message: string, pos: { x: number, y: number }, timeoutMs: number): void => {
  const container = createContainer();

  mount(Popup, {
    target: container, props: {
      message,
      pos,
      timeoutMs,
    }
  })
};

export const showTranslationPopup = (message: string, pos: { x: number, y: number }): void => {
  const container = createContainer();

  mount(TranslationPopup, {
    target: container, props: {
      message,
      pos,
    }
  })
}

export const showTranslationWindowPopup = (
  message: string,
  pos: { x: number, y: number },
  srcLang: { key: string; text: string },
  targetLang: { key: string; text: string },
  languageOptions: { key: string; text: string }[],
  image: Element | string,
): void => {
  const container = createContainer();

  mount(TranslationWindowPopup, {
    target: container, props: {
      initialMessage: message,
      pos,
      srcLang,
      targetLang,
      languageOptions,
      image,
    }
  })
}
