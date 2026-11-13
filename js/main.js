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
