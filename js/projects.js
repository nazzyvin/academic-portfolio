/* ==========================================================================
   projects.js — opens the "View details" dialog on projects.html
   Stage 3 lesson: event delegation + the native <dialog> element.

   The script is loaded with `defer`, so the browser has already parsed the
   whole page before any of this runs. Nothing here is needed to READ the
   page: without JavaScript the cards still show their title, description,
   tech tags and links.
   ========================================================================== */

/* --- 1. The long-form text ---------------------------------------------- */
// Only the EXTRA text lives here. The card titles, short descriptions and
// links stay in the HTML, so the page still makes sense without JavaScript.
// Each key must match a data-project value in projects.html: "chatbot" here
// is data-project="chatbot" on the first card's button.
// PLACEHOLDER: edit these three entries to match your real projects.
const projectDetails = {
  chatbot: {
    title: "AI Chatbot Assistant",
    summary: "I built a chatbot that answers questions from a private collection of documents instead of the open internet. Documents are uploaded through an admin panel, stored in a database and indexed in a vector database, so the app can find the passages that answer a question and reply with sources. The interface is plain JavaScript talking to a Python API, which keeps the model keys and the data off the browser.",
    learned: "This project taught me how a front end talks to a backend, why secrets must never sit in browser code, and why error states matter when a reply takes several seconds. [PLACEHOLDER: add one more thing you learned.]"
  },
  portfolio: {
    title: "Student Portfolio and Academic Planner",
    summary: "This is the site you are reading. It is a multi-page portfolio built by hand with HTML, CSS and JavaScript, covering my biography, my courses, my projects and a study planner. Every page shares one stylesheet, one navigation menu and one footer, so a change to the design happens in one file instead of five.",
    learned: "Building it one page at a time showed me why shared styles beat copy-and-paste, and how CSS Grid and Flexbox replace a lot of fiddly width rules. [PLACEHOLDER: add one more sentence.]"
  },
  third: {
    title: "[PLACEHOLDER: Project name]",
    summary: "[PLACEHOLDER: 3–4 sentences about the problem this project solves, what you built, and how someone uses it.]",
    learned: "[PLACEHOLDER: what did this project teach you?]"
  }
};

/* --- 2. The elements the rest of the file needs ------------------------- */
// querySelector returns the first match, or null when nothing matches.
const projectGrid = document.querySelector("#project-grid");
const dialog = document.querySelector("#project-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogSummary = document.querySelector("#dialog-summary");
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
  dialogTitle.textContent = details.title;
  dialogSummary.textContent = details.summary;
  dialogLearned.textContent = details.learned;

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
if (projectGrid && dialog && dialogTitle && dialogSummary && dialogLearned && dialogClose) {
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
