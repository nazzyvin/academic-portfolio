/* ==========================================================================
   contact.js - checks the contact form on contact.html
   Stage 4 lesson: forms, preventDefault, functions that return values,
   regular expressions, and live error messages.

   Loaded only on contact.html, with `defer`, so the whole form already exists
   in the page before this file runs.

   This site is static: there is no server. A "successful" submit only proves
   the values passed the checks below - nothing is sent anywhere, and the
   success message says so on purpose.
   ========================================================================== */

/* --- 1. The rules ------------------------------------------------------- */
// A regular expression (regex) is a pattern for text. Between the slashes:
//   ^        "the match must start here"
//   [^\s@]+  "one or more characters that are NOT whitespace (\s) and NOT @"
//   @        "a literal @ sign"
//   \.       "a literal dot" (a bare . would mean "any character")
//   $        "the match must end here"
// So: text, @, text, dot, text - with no spaces anywhere.
// No email regex is perfect: this one accepts a@b.com and rejects a@b, which
// is exactly the simple rule this project needs.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   ^\d+$  = digits (\d) from the first character to the last, nothing else.
// `\d` is the same as [0-9], so a letter O or a dash fails the test.
const PHONE_PATTERN = /^\+?[0-9\s().-]+$/;

// Each rule below is one small function that takes the field's text and
// RETURNS an error message, or "" (empty string) when the text is fine.
// Returning the message — instead of showing it here — keeps the checking
// separate from the page, which makes each rule easy to read and reuse.
function validateName(value) {
  // trim() removes spaces at both ends, so "   " becomes "" and counts as
  // empty. Without it, a field holding only spaces would look filled in.
  if (value.trim() === "") {
    return "Please enter your name.";
  }
  return "";
}

function validateEmail(value) {
  const cleaned = value.trim();

  if (cleaned === "") {
    return "Please enter your email address.";
  }
  if (!EMAIL_PATTERN.test(cleaned)) {
    return "Please enter a valid email address, like name@example.com.";
  }
  return "";
}


function validatePhone(value) {
  const cleaned = value.trim();

  // Phone number is optional.
  if (cleaned === "") {
    return "";
  }

  // Only allow digits, an optional leading +, spaces,
  // brackets and hyphens.
  if (!PHONE_PATTERN.test(cleaned)) {
    return "Please enter a valid phone number.";
  }

  // Remove formatting characters before checking digit count.
  const digits = cleaned.replace(/[\s().-]/g, "");

  // International numbers generally contain 7–15 digits.
  if (digits.replace("+", "").length < 7 ||
      digits.replace("+", "").length > 15) {
    return "Your phone number should contain between 7 and 15 digits.";
  }

  return "";
}

function validateMessage(value) {
  if (value.trim() === "") {
    return "Please write a short message.";
  }
  return "";
}

/* --- 2. The elements ---------------------------------------------------- */
const form = document.querySelector("#contact-form");

// The page's status line and the form's four fields are only usable when the
// form exists, so everything that touches them lives inside this `if`.
if (form) {
  // One object per field: the input, its error paragraph, and the rule that
  // checks it. Keeping them together means one loop can handle all four.
  const fields = [
    {
      input: form.querySelector("#name"),
      error: form.querySelector("#name-error"),
      validate: validateName
    },
    {
      input: form.querySelector("#email"),
      error: form.querySelector("#email-error"),
      validate: validateEmail
    },
    {
      input: form.querySelector("#phone"),
      error: form.querySelector("#phone-error"),
      validate: validatePhone
    },
    {
      input: form.querySelector("#message"),
      error: form.querySelector("#message-error"),
      validate: validateMessage
    }
  ];

  const status = form.querySelector("#form-status");

  /* --- 3. Show, clear and check one field ------------------------------- */
  // textContent puts the message in as plain text. innerHTML would treat it
  // as markup, which we never want for something we did not write by hand.
  function showError(field, message) {
    field.error.textContent = message;
    // aria-invalid is both the styling hook (see style.css) and the hint
    // screen readers use to say "this field has a problem".
    field.input.setAttribute("aria-invalid", "true");
  }

  function clearError(field) {
    field.error.textContent = "";
    field.input.removeAttribute("aria-invalid");
  }

  // Runs the field's own rule and updates the page, then returns true or
  // false so the submit handler can count the failures.
  function checkField(field) {
    const message = field.validate(field.input.value);

    if (message !== "") {
      showError(field, message);
      return false;
    }

    clearError(field);
    return true;
  }

  /* --- 4. The status line ----------------------------------------------- */
  function setStatus(message, state) {
    status.textContent = message;

    // Remove both classes first so an old success cannot stay on screen
    // while an error is showing.
    status.classList.remove("is-error", "is-success");

    if (state === "error") {
      status.classList.add("is-error");
    } else {
      status.classList.add("is-success");
    }
  }

  /* --- 5. On submit ----------------------------------------------------- */
  form.addEventListener("submit", function (event) {
    // A submit normally reloads the page or navigates away. preventDefault()
    // stops that so our code can finish first. The form has no action or
    // method on purpose: even without this line nothing would reach a server.
    event.preventDefault();

    let invalidCount = 0;
    let firstInvalid = null;

    // Check every field, not just the first bad one, so the visitor sees all
    // the problems at once instead of fixing them one submit at a time.
    fields.forEach(function (field) {
      const isValid = checkField(field);

      if (!isValid) {
        invalidCount = invalidCount + 1;

        // Only remember the FIRST invalid field: that is where focus goes.
        if (firstInvalid === null) {
          firstInvalid = field;
        }
      }
    });

    if (firstInvalid) {
      const message =
        invalidCount === 1
          ? "One field needs fixing. Check the message under it."
          : invalidCount + " fields need fixing. Check the messages under them.";

      setStatus(message, "error");

      // Moving focus there means a keyboard or screen reader user lands on
      // the problem instead of having to hunt for it.
      firstInvalid.input.focus();
      return;
    }

    // Honest message: validation passed, but nothing was delivered.
    setStatus(
      "Thanks! Your details passed validation. This is a demo form, so the message was not actually sent.",
      "success"
    );

    // Empty the boxes, ready for another message.
    form.reset();
    fields.forEach(clearError);
  });

  /* --- 6. Live feedback ------------------------------------------------- */
  fields.forEach(function (field) {
    // blur fires when the field loses focus (tabbing or clicking away).
    field.input.addEventListener("blur", function () {
      // Only a completely untouched box is skipped. Whitespace counts as
      // typed-in, so "   " gets the "please enter your name" message here
      // instead of waiting until submit.
      const isUntouched = field.input.value === "";
      const alreadyShowing = field.error.textContent !== "";

      if (isUntouched && !alreadyShowing) {
        return;
      }

      checkField(field);
    });

    // While typing, re-check only fields that are already showing an error.
    // That clears the message the moment the value becomes valid, without
    // flashing red at someone who is still halfway through typing.
    field.input.addEventListener("input", function () {
      if (field.error.textContent !== "") {
        checkField(field);
      }
    });
  });
} else {
  // Helps if this file is ever loaded on a page without the form.
  console.warn("contact.js: form #contact-form was not found on this page.");
}
