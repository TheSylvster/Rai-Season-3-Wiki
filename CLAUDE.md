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

- The look: clear liquid glass over a drifting blocky Minecraft-style dusk landscape (`paintBackdrop` in `assets/wiki.js`; InterPhyr Modern has ribbons instead, so keep the two sites looking different), the Rai emblem as logo (`images/rai-logo.png`, also the tab icon `assets/icon.png`) and a warm dusk glass tint. The landscape is three parallax layers (sky, far hills, near hills: `PARALLAX` in `wiki.js`) drawn bigger than the screen; fill blocks as one shape per colour so no lines show between them, using the system font, so nothing is downloaded. Each branch has an accent colour (`sections` in `content.js`).
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

## Working with the owner

The owner is the site's creator. Claude does all the technical work and the owner directs it. These notes describe how they like to work, so every PC's Claude behaves the same way.

### How the owner talks

- Messages are short and typed quickly, often with typos ("thing" for "think"). Read for the intent and don't comment on the spelling.
- **Questions are questions.** "Could we…?", "should…?", "what do you think…?" or "im asking" mean they want an opinion or a plan, not a change. Answer, recommend one option, and wait. Building something they only asked about has annoyed them before ("AGAIN IM ASKING").
- **Clear instructions mean do it all now.** "Add…", "make it…", "fix…", "push it" or "continue" mean do the whole job: edit, test, push, check that it's live, and report.
- They often send follow-ups while Claude is still working, like "also…" or "dont make it yet". Fold them into the current job, or stop straight away if they say so.
- Screenshots usually point at something to change or a bug. Look closely at what's shown.
- When a choice is really theirs (a look, a name, who can see something), ask with a few clear options and one marked as recommended. Otherwise use good judgement and don't over-ask.

### Skill level

- They aren't a programmer, but they're comfortable with GitHub, VS Code and the browser's inspect tool and console (they type preview codes such as `SETFEDCON1` there).
- Explain results in plain words: what changed, where to see it, and what to press. Skip code explanations unless they ask.
- When they need to do something, give exact steps (for example "press Ctrl+F5 if you still see the old version").

### How work gets done (every change)

1. Pull first, then make the change.
2. Test it yourself in a real browser before pushing (headless Chrome against a local test server works), on desktop and phone widths. Check for script errors, broken images, sideways scrolling and the actual behaviour. For motion, take slow-motion screenshots.
3. Follow the version and changelog rules in this file. Small tweaks or fixes to something just released don't get a version bump.
4. Push, then check the live site until the change is there, and only then say it's live.
5. Report briefly. A short heading per change, what they'll see, anything not done or still open, and how to view it. No long essays.

### Taste and style

- **"Smooth, natural and modern."** Nothing may jump, snap or "teleport". Everything that moves, opens or closes animates, but stays quick and calm.
- They love the Apple-style **clear liquid glass** look (references: liquidglassdesign.com, Apple's liquid glass demos). Sliders and selection highlights are clear lenses that bend what's underneath, with a bright rim and a faint rainbow fringe. Pressed buttons briefly turn into that glass.
- They notice details: clipped letters, cut-off shadows, thin lines between blocks, things not lining up, the wrong font. Check those before reporting.
- Keep fonts and styles consistent with the rest of the site, and keep each site's own identity (the sites should not look identical).
- They like in-world touches and maker's marks, and humour where the site calls for it (InterPhyr is satire), but no real accusations against real people.

### Safety

- Never repeat, print or commit passwords, logins or private documents. Secret material stays in the owner's private folders, outside the repos.
- Publishing, creating repos and other public steps are fine when the owner asks for them. Anything destructive or irreversible needs their OK first.
