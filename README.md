# Academic Portfolio

A responsive, multi-page student portfolio and academic management website,
built with plain HTML, CSS and vanilla JavaScript. No frameworks, no build
tools, no npm packages.

**Stage 1 (this version):** shared header/navigation/footer, the homepage, and
placeholder pages for About, Projects, Planner and Contact.

## Folder structure

```
academic-portfolio/
├── index.html                 Homepage (hero, bio, audio, quick links)
├── about.html                 Placeholder — "Coming soon"
├── projects.html              Placeholder — "Coming soon"
├── planner.html               Placeholder — "Coming soon"
├── contact.html               Placeholder — "Coming soon"
├── css/
│   └── style.css              One stylesheet shared by every page
├── js/
│   └── main.js                Shared JS: mobile menu toggle
├── images/
│   ├── profile-placeholder.svg   Placeholder portrait (replace it)
│   └── favicon.svg               Browser tab icon
├── media/
│   ├── welcome-intro.wav      Placeholder audio (test chime — replace it)
│   └── README.txt             Notes about adding your own media
└── README.md
```

All links and asset paths are relative, so the site works from a file path,
a local server, or a GitHub Pages project URL without edits.

## Tech notes

- **Mobile-first CSS** with Flexbox and CSS Grid.
- **Design tokens** in `:root` — change a colour or spacing value once.
- **Accessible navigation:** real `<button>`, `aria-expanded`, `aria-controls`,
  visible focus styles, a skip link, and `aria-current="page"` on the active
  link. The menu is styled from `aria-current`, so the visual state cannot go
  out of sync with what assistive technology is told.
- **Animation** is limited and respects `prefers-reduced-motion`.
- **No JavaScript required to read the site:** a `<noscript>` rule reveals the
  navigation when scripting is off.
