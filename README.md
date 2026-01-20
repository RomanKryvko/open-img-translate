# Open Image Translate
---

A Firefox extension for translating text in images. It recognises the text using OCR and displays the translation in a pop-up. Simple as that.

## Features
- [x] A context menu for translating **images** (works on images).
- [x] A context menu for translating **an area of screen** (works anywhere on a page).
- [x] Support for Google Translate as a translation provider.
- [x] Support for DeepL as a translation provider.
- [x] A simple pop-up for displaying results.

## Planned features
- [ ] Settings page for user preferences (target language, translation provider, etc.).
- [ ] Option to display translations as an overlay on the page.
- [ ] Support for LibreTranslate as a translation provider.
- [ ] Porting to Chromium.

## Dependencies
### Runtime
* [tesseract.js](https://github.com/naptha/tesseract.js)
### Development
* Typescript
* Vite
* Svelte
* web-ext

## Building & Installing
1. Install the dependencies:
```sh
npm install
```

2. Bundle the extension:
```sh
npm run build
```
The bundled extension will be stored in the `dist/` directory. You can install it to your browser from there.

3. *(Optional for development)* Run Firefox with the extension temporarily installed.
```sh
npm run dev
```
This starts the `web-ext` tool, which auto-reloads the extension whenever files in `dist/` change, so that you only need to run `build` to test your latest changes.

# Usage
1. Image mode: After installing the extension, right-click an image containing text and select "Translate with OIT".
2. Area mode: Right-click anywhere on webpage, select "Translate selected area", then drag to select a rectangular region of the screen.
