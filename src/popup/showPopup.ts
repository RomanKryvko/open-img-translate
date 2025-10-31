import Popup from './Popup.svelte'
import TranslationPopup from './TranslationPopup.svelte'
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
