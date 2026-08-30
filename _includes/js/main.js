function inputsValid(inputsList) {
  for (let i = 0; i < inputsList.length; i++) {
    if (inputsList[i].required && !inputValid("#" + inputsList[i].id)) {
      inputsList[i].valid = false;
    } else {
      inputsList[i].valid = true;
    }
  }

  for (let i = 0; i < inputsList.length; i++) {
    if (!inputsList[i].valid) {
      return false;
    }
  }

  return true;
}

function markValidity(id) {
  const field = document.getElementById(id);
  if (!field) return;
  const errorId = id + "-error";
  let error = document.getElementById(errorId);
  if (!error) {
    error = document.createElement("p");
    error.id = errorId;
    error.className = "field-error";
    field.insertAdjacentElement("afterend", error);
  }
  const invalid = !field.validity.valid;
  field.setAttribute("aria-invalid", String(invalid));
  if (invalid) {
    field.setAttribute("aria-describedby", errorId);
    error.textContent = field.validity.typeMismatch ? "Enter a valid " + field.type + "." : "This field is required.";
  } else {
    field.removeAttribute("aria-describedby");
    error.textContent = "";
  }
}

function writeToLocalStorage(id) {
  let edValue = document.getElementById(id);
  let value = edValue.value;
  localStorage.setItem(id, value);
}

function clearForm(formId) {
  $(formId).trigger("reset");
  document.querySelectorAll(formId + " [aria-invalid]").forEach((field) => field.setAttribute("aria-invalid", "false"));
}

function inputValid(id) {
  const prop = $(id);
  if (prop.length == 0) {
    return false;
  }
  return prop[0].validity.valid;
}

function check(id) {
  markValidity(id);
}

function sendForm(form) {
  console.log("Submitted form", form);
  window.dataLayer.push({
    'event': 'landing-submit-lead', // This MUST match the Event name in your GTM Custom Event Trigger
  });
  fetch(form.url, {
    method: "POST",
    body: form.data,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Unable to submit the form. Please try again.");
      return response.json();
    })
    .then((data) => {
      clearForm("#" + form.id);
      
      announceFormStatus("Thank you for your interest. We will be in touch shortly.", false);
    })
    .catch(() => announceFormStatus("We could not submit the form. Please try again or call 619-201-8129.", true));
}

function announceFormStatus(message, isError) {
  const status = document.getElementById("form-status");
  if (!status) return;
  status.setAttribute("role", isError ? "alert" : "status");
  status.textContent = message;
  status.classList.toggle("form-status-error", isError);
  status.focus();
}

function formErrors(inputs) {
  for (let i = 0; i < inputs.length; i++) {
    markValidity(inputs[i].id);
  }

  announceFormStatus("Please correct the errors below.", true);
  const firstInvalid = inputs.map((input) => document.getElementById(input.id)).find((input) => input && input.getAttribute("aria-invalid") === "true");
  if (firstInvalid) firstInvalid.focus();
}

function setupAccordion() {
  const accordion = $(".accordion");
  if (accordion) {
    $(".accordion-panel").prop("hidden", true);
    $(".accordion-title").attr("aria-expanded", "false").on("click", function () {
      const panel = document.getElementById(this.getAttribute("aria-controls"));
      const expanded = this.getAttribute("aria-expanded") === "true";
      this.setAttribute("aria-expanded", String(!expanded));
      panel.hidden = expanded;
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  setupAccordion();

  document.querySelector(".skip-link")?.addEventListener("click", () => {
    requestAnimationFrame(() => document.getElementById("main-content")?.focus());
  });

  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.rel = "noopener noreferrer";
    if (!link.querySelector(".new-tab-warning")) {
      const warning = document.createElement("span");
      warning.className = "sr-only new-tab-warning";
      warning.textContent = " (opens in a new tab)";
      link.appendChild(warning);
    }
  });

  const focusHashTarget = () => {
    if (!window.location.hash) return;
    const target = document.getElementById(window.location.hash.slice(1));
    if (target) target.focus();
  };
  window.addEventListener("hashchange", focusHashTarget);
  focusHashTarget();
});
