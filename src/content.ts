browser.runtime.onMessage.addListener((message) => {
  if (message.type === "showTranslationPopup") {
    const existing = document.getElementById("translator-popup");
    if (existing) existing.remove();

    const popup = document.createElement("div");
    popup.id = "translator-popup";
    popup.classList.add("translator-popup");
    popup.textContent = message.result.trans;
    document.body.appendChild(popup);

    setTimeout(() => popup.remove(), 5000);
  }
});
