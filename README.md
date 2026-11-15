# Academic Portfolio

A responsive, five-page student portfolio and academic planner built with
plain HTML, CSS, and vanilla JavaScript. It has no framework, build step, or
package dependencies.

## Pages and features

- **Home** (`index.html`): introduction, selected work, audio introduction, and
  links to the rest of the site.
- **About** (`about.html`): education, goals, skills, and interests.
- **Projects** (`projects.html`): project cards with accessible detail dialogs.
- **Planner** (`planner.html`): add, complete, and delete study tasks saved in
  the browser's local storage.
- **Contact** (`contact.html`): contact details and a client-side validated
  demo form. The form does not send messages to a server.

Every page shares the same navigation, footer, stylesheet, and theme control.
The theme follows the device preference until a visitor chooses Light or Dark
Mode; that choice is saved in local storage and used on later visits.

## Project structure

```text
academic-portfolio/
├── index.html
├── about.html
├── projects.html
├── planner.html
├── contact.html
├── css/
│   ├── style.css       Shared layout, components, and theme colors
│   └── planner.css     Planner-specific styles
├── js/
│   ├── theme.js        Applies the saved or system theme before first paint
│   ├── main.js         Shared theme control and mobile navigation
│   ├── about.js        About page skill filters
│   ├── projects.js     Project detail dialogs
│   ├── planner.js      Study task behavior and storage
│   └── contact.js      Contact form validation
├── images/
│   ├── academic-portfolio.png
│   ├── blueflow.png
│   ├── favicon.svg
│   ├── my-profile.jpeg
│   ├── profile-placeholder.svg
│   └── qr-content-extractor.png
└── media/
    └── welcome-intro.mp3
```

## Running the site

Open `index.html` directly or serve the project directory with any static web
server. All page, stylesheet, script, and asset references use relative paths.
JavaScript is needed for the theme control, mobile menu, project dialogs,
planner, and contact form; the page content remains readable without it.

## Implementation notes

- Mobile-first layouts use Flexbox and CSS Grid.
- Shared colors and layout values are CSS custom properties in `css/style.css`.
- Theme selection uses the `data-theme` attribute on the document root. A saved
  choice takes priority over `prefers-color-scheme`; otherwise the operating
  system preference is followed, with Light Mode as the fallback.
- Navigation and controls include keyboard focus states and accessible labels.
- Motion respects `prefers-reduced-motion`.
