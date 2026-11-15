/* ==========================================================================
   projects.js — opens the "View details" dialog on projects.html
   Event delegation + the native <dialog> element.

   The script is loaded with `defer`, so the browser has already parsed the
   whole page before any of this runs. Nothing here is needed to READ the
   page: without JavaScript the cards still show their title, description,
   tech tags and links.
   ========================================================================== */

/* --- 1. The long-form text ---------------------------------------------- */
// Only the EXTRA text lives here. The card titles, short descriptions and
// links stay in the HTML, so the page still makes sense without JavaScript.
// Each key must match a data-project value in projects.html: "blueflow" here
// is data-project="blueflow" on the first card's button.
const projectDetails = {
  blueflow: {
    kicker: "Full-stack development",
    title: "BlueFlow",
    summary: "A task management application built with Django and Django REST Framework. It brings user authentication, named task lists and a responsive Bootstrap interface together, so the backend and the front end are exercised by the same product.",
    why: "I wanted to connect the two halves of web development instead of practising them separately. Django gave me models, authentication and an API; the front end had to use them in a real interface, which is where most of the learning happened.",
    features: [
      "User accounts with registration and sign-in handled by Django",
      "Create, edit, complete and delete tasks inside named lists",
      "A REST API built with Django REST Framework",
      "A responsive Bootstrap interface for desktop and phone screens",
      "Tasks and accounts stored in SQLite during development"
    ],
    tech: "Python · Django · Django REST Framework · SQLite · Bootstrap",
    learned: "The main lesson was that a backend is only half a product: an API has to be designed around what the interface actually needs. I also got comfortable with Django's authentication, its ORM, and the point where a framework's defaults stop being enough."
  },
  portfolio: {
    kicker: "Frontend development",
    title: "Academic Portfolio",
    summary: "This is the site you are reading. It brings my academic background, projects, skills and study planning together across five pages, and every page shares one stylesheet, one navigation menu and one footer.",
    why: "COS 106 introduced the technologies I had been using informally, and I wanted the assignment to outlast the semester. Rather than a single page of coursework, I built the place where the rest of my work could live.",
    features: [
      "Five pages covering home, about, projects, the planner and contact",
      "One shared stylesheet, header and footer across every page",
      "A weekly planner that keeps its tasks in the browser's local storage",
      "A contact form with inline validation and accessible error messages",
      "Responsive layouts, keyboard-friendly navigation and reduced-motion support"
    ],
    tech: "HTML · CSS · JavaScript",
    learned: "Writing five pages by hand showed me why shared styles beat copied rules, and how CSS Grid and Flexbox remove most width guesswork. I also learned that accessibility is mostly a set of decisions made early — headings, labels, focus states — rather than something added at the end."
  },
  qr: {
    kicker: "Backend development",
    title: "QR Content Extractor",
    summary: "A web application that reads QR codes and barcodes from an image, works out what kind of content they hold, and offers the action that fits: open the link, copy the text, download the file or save the contact.",
    why: "It started as a command-line tool. Checking a code meant opening a terminal, so the obvious next step was a browser interface that anyone could use without installing Python.",
    features: [
      "Scan a code with the camera or upload an image",
      "Decode QR Code, Code 128, Code 39, EAN-13, EAN-8, UPC-A, UPC-E and ITF",
      "Detect links, text, email, phone, SMS, Wi-Fi, location and vCard contacts",
      "Offer the matching action: open a link, copy text, download a file or save contact details",
      "The original command-line tool is still included"
    ],
    tech: "Python · FastAPI · HTML · CSS · JavaScript",
    learned: "Moving code from a terminal to a browser forced me to separate the decoding logic from the interface, which made both easier to test. I also learned how much of backend work is really input handling: file types, empty results, unreadable images and content that matches nothing expected."
  }
};

/* --- 2. The elements the rest of the file needs ------------------------- */
// querySelector returns the first match, or null when nothing matches.
const projectGrid = document.querySelector("#project-grid");
const dialog = document.querySelector("#project-dialog");
const dialogKicker = document.querySelector("#dialog-kicker");
const dialogTitle = document.querySelector("#dialog-title");
const dialogSummary = document.querySelector("#dialog-summary");
const dialogWhy = document.querySelector("#dialog-why");
const dialogFeatures = document.querySelector("#dialog-features");
const dialogTech = document.querySelector("#dialog-tech");
const dialogLearned = document.querySelector("#dialog-learned");
const dialogClose = document.querySelector(".dialog-close");

// Remembers which button opened the dialog, so focus can go back there when
// it closes. null means "nothing is open".
let lastTrigger = null;

/* --- 3. Fill the dialog, then show it ----------------------------------- */
function openProjectDialog(projectId, trigger) {
  const details = projectDetails[projectId];

  // A typo in data-project would otherwise fill the dialog with "undefined".
  if (!details) {
    console.warn('projects.js: no details found for data-project="' + projectId + '"');
    return;
  }

  // textContent treats the strings as plain text. innerHTML would parse them
  // as markup, so a stray "<" in your notes could break the page.
  dialogKicker.textContent = details.kicker;
  dialogTitle.textContent = details.title;
  dialogSummary.textContent = details.summary;
  dialogWhy.textContent = details.why;
  dialogTech.textContent = details.tech;
  dialogLearned.textContent = details.learned;

  // The feature list is rebuilt each time, so the previous project's items
  // do not linger. replaceChildren() empties the <ul> in one call.
  dialogFeatures.replaceChildren();
  details.features.forEach(function (feature) {
    const item = document.createElement("li");
    item.textContent = feature;
    dialogFeatures.append(item);
  });

  lastTrigger = trigger;
  dialog.showModal(); // modal: the page behind is inert, Escape works
}

/* --- 4. Close it, then give focus back ---------------------------------- */
function closeProjectDialog() {
  dialog.close();
}

// The dialog fires "close" however it was closed: the X button, Escape, a
// click on the backdrop, or a direct dialog.close() call. Listening for that
// one event means focus is restored on every route.
function restoreFocus() {
  if (lastTrigger) {
    lastTrigger.focus();
    lastTrigger = null;
  }
}

/* --- 5. Wire it up ------------------------------------------------------ */
// If this file is ever loaded on a page without the markup, stop with a
// warning instead of throwing "cannot read properties of null".
if (
  projectGrid &&
  dialog &&
  dialogKicker &&
  dialogTitle &&
  dialogSummary &&
  dialogWhy &&
  dialogFeatures &&
  dialogTech &&
  dialogLearned &&
  dialogClose
) {
  // ONE listener for all three buttons (and any you add later). A click on a
  // button bubbles up to the grid, so the grid hears every button's clicks.
  projectGrid.addEventListener("click", function (event) {
    // event.target is the deepest element clicked — often the span inside the
    // button, not the button itself. closest() walks up the family tree from
    // there and returns the nearest ancestor matching [data-project].
    const trigger = event.target.closest("[data-project]");

    if (!trigger) {
      return; // clicked empty space in a card: nothing to open
    }

    openProjectDialog(trigger.dataset.project, trigger);
  });

  dialogClose.addEventListener("click", closeProjectDialog);

  // The dialog element itself is the backdrop area. A click inside the white
  // box has .dialog-inner as its target, so this only runs for outside clicks.
  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) {
      closeProjectDialog();
    }
  });

  dialog.addEventListener("close", restoreFocus);
} else {
  console.warn("projects.js: the project grid or dialog markup is missing.");
}
