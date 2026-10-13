# Rai Season 3 Wiki: working rules

The Rai Season 3 Wiki is the wiki for the whole Rai Minecraft server (Season 3), not just the PAF. It is hosted on GitHub Pages at https://thesylvster.github.io/Rai-Season-3-Wiki/. It shares its "liquid glass" design with InterPhyr Modern (TheSylvster/InterPhyr, `/Modern/`).

This file holds the owner's standing instructions. Follow them on every change. The repo is **public**, so never put secrets in it.

## Every push

1. **Pull first** (`git pull --ff-only`). The site is edited from more than one PC.
2. **Bump the version** (`version` near the top of `assets/content.js`, shown in the footer) and **add an entry to `changelog`** (shown on the Update Logs page, newest first) in the same commit: V1.0.0, then V1.0.1, V1.0.2, and so on. Small tweaks and fixes to something just released don't need a bump.
3. **Test in a real browser** (headless Chrome against a local server works) on desktop and phone widths: no script errors, no broken images, no sideways scrolling.
4. **Verify the deploy**: after pushing, poll the live site (add `?cb=<random>` to get past the cache) until the change is live, then tell the owner.

## Content

- **Neutral wiki tone, no propaganda.** This is not InterPhyr. Write plainly and factually, like a normal wiki.
- Maker's marks are fine, like a signature on a painting. The footer says "Built by Sylvia Valentina · Built with Visual Studio Code". Keep it.
- The crafting information comes from **JR's Crafting Guide for Season 3** (https://sites.google.com/view/whole-website-thing/home). Keep the credit in the footer.
- The owner asks Claude to make changes. All page content lives in **`assets/content.js`**, and the comment at its top explains the block types and the `{{path|label}}` link syntax.
- **To add a page:** add its entry to `content.js` (path, title, section, parent, summary, blocks), then run `perl tools/make-pages.pl .` to create its folder and `index.html`. Pages without a folder still work through `404.html`, but they should get one.
- **Images:** every image is stored in `images/` (no hot-linking), named after its page (`industrial-muskets-musket-1.png`). Big screenshots are saved as JPEG at 1280px wide or less. Small recipe pictures stay PNG so the pixels stay sharp.

## Design (same rules as InterPhyr Modern)

- The look: clear liquid glass over a drifting blocky Minecraft-style dusk landscape (`paintBackdrop` in `assets/wiki.js`; InterPhyr Modern has ribbons instead, so keep the two sites looking different), a pixel grass-block logo and a warm dusk glass tint. The landscape is three parallax layers (sky, far hills, near hills: `PARALLAX` in `wiki.js`) drawn bigger than the screen; fill blocks as one shape per colour so no lines show between them, using the system font, so nothing is downloaded. Each branch has an accent colour (`sections` in `content.js`).
- **Motion rule: everything must feel smooth, natural and modern. Nothing may jump or "teleport".** Page changes animate (`navigate()`), and links to a place on the same page glide there (`glideTo()`). Anything that opens, closes or moves animates (search, picture zoom, phone menu). Visitors who turn on "reduce motion" get instant changes instead.
- **Slider rule: every slider or selection highlight must be a CLEAR liquid-glass lens built with `makeLens()`.** Clear means no frosted or white fill. It has a bright rim, a faint rainbow fringe, a soft shadow, and refracted content underneath. It always slides like liquid and never snaps. This covers the menu bar and the phone menu, and any tabs or toggles added later.
- On phones, the menu is the round glass button that melts open into a panel (`buildMenu()`).
- **Glass buttons:** buttons like Update Logs use `makeGlassButton()` / `glassButton()`. While pressed they turn into clear liquid glass (swell, rim, rainbow fringe, bent text) and spring back on release.

## Files

- `assets/content.js`: all pages (the only file to edit for content).
- `assets/wiki.js`: builds the pages (background, glass, lens, phone menu, search, picture zoom, page changes).
- `assets/wiki.css`: styles.
- `tools/make-pages.pl`: writes each page's `index.html` and `404.html` from `content.js`.
- `404.html` uses full paths (`/Rai-Season-3-Wiki/...`). If the repo is ever renamed, update them by running `tools/make-pages.pl`, after changing the path in it.
