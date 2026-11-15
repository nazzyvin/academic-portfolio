/* ==========================================================================
   about.js — builds the "Technical skills" section on about.html
   Stage 2 lesson: turn an array of objects into DOM elements, then filter it.

   This file is loaded only on about.html, with `defer`, so the browser has
   finished reading the HTML before any of this runs.
   ========================================================================== */

/* --- 1. The data -------------------------------------------------------- */
// An array holding one object per skill. Each object has a name, a category
// and a descriptive proficiency label. Soft skills have no proficiency,
// because they are not rated on the same scale.
// PLACEHOLDER DATA: edit the names, categories and labels below.

const skills = [
  // Languages & Technologies
  { name: "Python", category: "Languages & Technologies", proficiency: "Proficient" },
  { name: "HTML", category: "Languages & Technologies", proficiency: "Intermediate" },
  { name: "CSS", category: "Languages & Technologies", proficiency: "Developing" },
  { name: "JavaScript", category: "Languages & Technologies", proficiency: "Developing" },
  { name: "FastAPI", category: "Languages & Technologies", proficiency: "Intermediate" },
  { name: "Django", category: "Languages & Technologies", proficiency: "Developing" },
  { name: "Django REST Framework", category: "Languages & Technologies", proficiency: "Developing" },
  { name: "SQLite", category: "Languages & Technologies", proficiency: "Beginner" },

  // Tools
  { name: "Git & GitHub", category: "Tools", proficiency: "Intermediate" },
  { name: "VS Code", category: "Tools", proficiency: "Proficient" },
  { name: "Postman", category: "Tools", proficiency: "Beginner" },
  { name: "Figma", category: "Tools", proficiency: "Beginner" },
  { name: "Chrome DevTools", category: "Tools", proficiency: "Familiar" },

  // Soft Skills
  { name: "Problem Solving", category: "Soft Skills" },
  { name: "Communication", category: "Soft Skills" },
  { name: "Adaptability", category: "Soft Skills" },
  { name: "Continuous Learning", category: "Soft Skills" }
];

/* --- 2. The elements we need ------------------------------------------- */
// querySelector returns the first match, or null if there is none.
const skillsList = document.querySelector('#skills-list');
const skillsStatus = document.querySelector('#skills-status');
const filterButtons = document.querySelectorAll('[data-filter]');

// The order the groups appear in. If you add a new category to the data,
// add it here too, or those skills will not be shown.
const categoryOrder = ["Languages & Technologies", "Tools", "Soft Skills"];

/* --- 3. One skill object -> one list item ------------------------------- */
function createSkillCard(skill) {
  // <li class="skill-card"> is the outer box for one skill.
  const card = document.createElement('li');
  card.className = 'skill-card';

  const head = document.createElement('div');
  head.className = 'skill-head';

  // textContent puts text in as text. If a name ever contained "<b>", it
  // would be shown literally instead of being treated as HTML.
  const name = document.createElement('span');
  name.className = 'skill-name';
  name.textContent = skill.name;
  head.appendChild(name);

  // Soft skills have no proficiency rating, so they get no badge.
  if (skill.proficiency) {
    const badge = document.createElement('span');
    badge.className = 'skill-badge';
    badge.textContent = skill.proficiency;

    // A hidden prefix gives the label context when read aloud.
    const prefix = document.createElement('span');
    prefix.className = 'visually-hidden';
    prefix.textContent = 'Proficiency: ';
    badge.prepend(prefix);

    head.appendChild(badge);
  }

  card.appendChild(head);
  return card; // hand the finished element back to the caller
}

/* --- 4. One category -> one group with a heading ------------------------ */
function createSkillGroup(category, categorySkills) {
  const group = document.createElement('div');
  group.className = 'skill-group';

  const title = document.createElement('h3');
  title.className = 'skill-group-title';
  title.textContent = category;
  group.appendChild(title);

  // A list is the honest element here: each card is one item in a set.
  const grid = document.createElement('ul');
  grid.className = 'skills-grid';

  categorySkills.forEach(function (skill) {
    grid.appendChild(createSkillCard(skill));
  });

  group.appendChild(grid);
  return group;
}

/* --- 5. Render any list of skills --------------------------------------- */
function renderSkills(list) {
  // Guard: this file might one day be loaded on a page without the container.
  if (!skillsList) {
    console.warn('about.js: no #skills-list element was found.');
    return;
  }

  // Remove everything inside the container before drawing the new list.
  skillsList.replaceChildren();

  categoryOrder.forEach(function (category) {
    // filter() returns a NEW array containing only the matching skills.
    const inCategory = list.filter(function (skill) {
      return skill.category === category;
    });

    // An empty group would leave a heading with nothing under it.
    if (inCategory.length > 0) {
      skillsList.appendChild(createSkillGroup(category, inCategory));
    }
  });

  // A polite status message for screen-reader users (role="status").
  if (skillsStatus) {
    const label = list.length === 1 ? 'skill' : 'skills';
    skillsStatus.textContent = 'Showing ' + list.length + ' ' + label + '.';
  }
}

/* --- 6. Make the filter buttons work ------------------------------------ */
filterButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    const chosen = button.dataset.filter; // "all", "Languages & Technologies", ...

    // Exactly one button is pressed at a time.
    filterButtons.forEach(function (otherButton) {
      otherButton.setAttribute('aria-pressed', otherButton === button ? 'true' : 'false');
    });

    // "all" keeps the whole array; anything else creates a filtered copy.
    const visibleSkills = chosen === 'all'
      ? skills
      : skills.filter(function (skill) {
          return skill.category === chosen;
        });

    renderSkills(visibleSkills); // re-render with the smaller list
    console.log('Filter:', chosen, '→', visibleSkills.length, 'skills');
  });
});

/* --- 7. Draw the list once when the page loads -------------------------- */
renderSkills(skills);
