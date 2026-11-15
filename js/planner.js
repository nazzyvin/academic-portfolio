/* ==========================================================================
   planner.js — behaviour for the Academic Planner page only

   planner.html loads this file with the defer attribute from inside <head>,
   so it runs once the whole page has been parsed: every element it needs
   already exists.

   How the page works, in three sentences:
     1. The `tasks` array is the truth. The HTML list is only a copy of it.
     2. Any change updates the array, then render() redraws the list.
     3. After each change the array is saved to localStorage, and on load it
        is read back, so the list survives a refresh.
   ========================================================================== */

/* --- 1. Find the elements (they must exist in planner.html) ------------- */

const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');
const emptyMessage = document.querySelector('#task-empty');
const counter = document.querySelector('#task-counter');

/* --- 2. The state ------------------------------------------------------- */

const STORAGE_KEY = 'planner-tasks';

// One task looks like: { id: 1, text: 'Revise chapter 3', completed: false }
let tasks = [];

// Ids must never repeat, even after a refresh, so the next one is always one
// more than the biggest id already in the array (set up further down).
let nextId = 1;

/* --- 3. Saving and loading (localStorage holds strings only) ------------ */

function saveTasks() {
  try {
    // JSON.stringify turns the array into text, e.g. '[{"id":1,...}]'.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    // Private browsing or a full disk can refuse storage. The page still
    // works, it just will not remember anything after a refresh.
    console.warn('Could not save tasks:', error);
  }
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    // JSON.parse turns the text back into a real array.
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Never trust stored data: keep only the entries that look like a task,
    // so one broken record cannot crash render().
    return parsed.filter(function (task) {
      return task &&
        typeof task.id === 'number' &&
        typeof task.text === 'string' &&
        typeof task.completed === 'boolean';
    });
  } catch (error) {
    // Corrupted text is not a reason to break the page: start empty instead.
    console.warn('Stored tasks were unreadable, starting empty:', error);
    return [];
  }
}

/* --- 4. Drawing the list ------------------------------------------------ */

function render() {
  // Start from nothing, then rebuild every row from the array. It is slower
  // than editing one row by hand, but there is no way for the two to drift
  // out of sync, and the lists here are tiny.
  list.textContent = '';

  tasks.forEach(function (task) {
    /* <li class="task-item" data-id="1"> */
    const item = document.createElement('li');
    item.className = task.completed ? 'task-item is-complete' : 'task-item';
    item.dataset.id = String(task.id);

    /* <input class="task-check" type="checkbox" id="task-check-1"> */
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-check';
    checkbox.id = 'task-check-' + task.id;
    checkbox.checked = task.completed;

    /* <label class="task-text" for="task-check-1">…</label>
       The for and the id must match, or clicking the words does nothing. */
    const label = document.createElement('label');
    label.className = 'task-text';
    label.htmlFor = 'task-check-' + task.id;
    // textContent, not innerHTML: a task typed as "<b>hello</b>" shows the
    // characters instead of being turned into a bold tag.
    label.textContent = task.text;

    /* <button class="task-delete" aria-label="Delete task: …">×</button> */
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'task-delete';
    deleteButton.setAttribute('aria-label', 'Delete task: ' + task.text);

    const deleteIcon = document.createElement('span');
    deleteIcon.setAttribute('aria-hidden', 'true');
    deleteIcon.textContent = '×';
    deleteButton.appendChild(deleteIcon);

    item.appendChild(checkbox);
    item.appendChild(label);
    item.appendChild(deleteButton);
    list.appendChild(item);
  });

  // The empty state shows only when there is nothing to show.
  // (This works because planner.css must not set display on .task-empty,
  //  or it would override the [hidden] attribute.)
  emptyMessage.hidden = tasks.length > 0;

  updateCounter();
}

function updateCounter() {
  if (tasks.length === 0) {
    // No tasks, no count: the empty message is the only thing to say.
    counter.textContent = '';
    return;
  }

  const completed = tasks.filter(function (task) {
    return task.completed;
  }).length;

  const taskWord = tasks.length === 1 ? 'task' : 'tasks';
  counter.textContent = tasks.length + ' ' + taskWord + ', ' + completed + ' completed';
}

/* --- 5. Adding a task --------------------------------------------------- */

function addTask(text) {
  const trimmed = text.trim();

  // Ignore empty input. The input has `required`, so a truly empty box is
  // stopped by the browser first — but "   " passes that, hence the trim.
  if (trimmed === '') return;

  tasks.push({ id: nextId, text: trimmed, completed: false });
  nextId += 1;

  input.value = '';
  render();
  saveTasks();

  const lastRow = list.lastElementChild;
  if (lastRow) lastRow.classList.add('is-new');
}

form.addEventListener('submit', function (event) {
  event.preventDefault(); // without this the browser reloads the page
  addTask(input.value);
  input.focus(); // cursor back in the box, ready for the next task
});

/* --- 6. Completing and deleting -----------------------------------------
   One listener on the <ul>, not one per row. The listener survives every
   re-render automatically, and new rows are covered with no extra work.
   ------------------------------------------------------------------------ */

list.addEventListener('change', function (event) {
  // A change can bubble up from anything in the row; only the checkbox counts.
  if (!event.target.classList.contains('task-check')) return;

  const item = event.target.closest('.task-item');
  if (!item) return;

  const id = Number(item.dataset.id);
  const task = tasks.find(function (entry) {
    return entry.id === id;
  });
  if (!task) return;

  task.completed = event.target.checked;
  render();
  saveTasks();

  // render() threw away the checkbox that had focus, which would send a
  // keyboard user back to the top of the page. Put focus on the new copy.
  const sameBox = document.getElementById('task-check-' + id);
  if (sameBox) sameBox.focus();
});

list.addEventListener('click', function (event) {
  // The click may land on the × inside the button, so look upwards for it.
  const button = event.target.closest('.task-delete');
  if (!button) return;

  const item = button.closest('.task-item');
  if (!item) return;

  const id = Number(item.dataset.id);

  // filter() returns a new array without the deleted task.
  tasks = tasks.filter(function (entry) {
    return entry.id !== id;
  });

  render();
  saveTasks();

  // The button that was clicked no longer exists, so move focus somewhere
  // predictable rather than letting it fall back to the top of the page.
  input.focus();
});

/* --- 7. Start the page -------------------------------------------------- */

tasks = loadTasks();
nextId = tasks.reduce(function (max, task) {
  return Math.max(max, task.id);
}, 0) + 1;
render();
