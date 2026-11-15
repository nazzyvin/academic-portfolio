/* ==========================================================================
   main.js — shared behaviour for every page
   Stage 1: the mobile hamburger menu.

   This file is loaded at the very end of <body>, which means the header
   above it already exists in the page by the time this code runs.
   ========================================================================== */

/* --- Step 1: find the two elements we need ----------------------------- */

// document.querySelector() returns the FIRST element that matches a CSS
// selector — the same kind of selector used in style.css.
// It returns null if nothing matches, so we check the result below.
const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.querySelector('#primary-nav');
const themeToggle = document.querySelector('.theme-toggle');

if (themeToggle) {
  let manuallySelected = false;
  const setTheme = function (theme) {
    document.documentElement.dataset.theme = theme;
    const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    themeToggle.setAttribute('aria-label', label);
    themeToggle.setAttribute('title', label);
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute('content', theme === 'dark' ? '#172b35' : '#f7f8f5');
  };

  setTheme(document.documentElement.dataset.theme || 'light');
  themeToggle.addEventListener('click', function () {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    manuallySelected = true;
    setTheme(theme);
    try { localStorage.setItem('portfolio-theme', theme); } catch (_) { /* Theme still applies for this page. */ }
  });

  if (window.matchMedia) {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
    const followSystem = function (event) {
      let hasSavedChoice = false;
      try { hasSavedChoice = localStorage.getItem('portfolio-theme') === 'light' || localStorage.getItem('portfolio-theme') === 'dark'; } catch (_) { /* Use the in-memory selection when storage is unavailable. */ }
      if (!manuallySelected && !hasSavedChoice) setTheme(event.matches ? 'dark' : 'light');
    };
    if (systemTheme.addEventListener) systemTheme.addEventListener('change', followSystem);
    else if (systemTheme.addListener) systemTheme.addListener(followSystem);
  }
}

/* --- Step 2: react when the button is clicked -------------------------- */

// addEventListener('click', ...) stores a function and runs it only when
// the button is clicked. The `if` guards against a page without a menu.
if (navToggle && primaryNav) {
  navToggle.addEventListener('click', function () {
    const isMenuOpen = primaryNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isMenuOpen ? 'true' : 'false');
  });

  // Close the menu when the visitor presses Escape.
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      primaryNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}
