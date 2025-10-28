import Popup from './Popup.svelte'
import { mount } from 'svelte'

export const showPopup = (message: string, pos: { x: number, y: number }, timeoutMs: number = 0): void => {
  const existing = document.getElementById("translator-popup");
  if (existing) existing.remove();

  const container = document.createElement("div");
  container.id = "translator-popup";
  document.body.appendChild(container);

  mount(Popup, {
    target: container, props: {
      message,
      pos,
      timeoutMs,
    }
  })
};
