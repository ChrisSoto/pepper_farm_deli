function inputsValid(inputsList) {
  
  for (let i = 0; i < inputsList.length; i++) {
    if (inputsList[i].required && !inputValid('#' + inputsList[i].id)) {
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
  if (inputValid('#' + id)) {
    $('#' + id).removeClass('bg-red-200').addClass('bg-gray-100');
  } else {
    $('#' + id).removeClass('bg-gray-100').addClass('bg-red-200');
  }
}

function writeToLocalStorage(id) {
  let edValue = document.getElementById(id);
  let value = edValue.value;
  localStorage.setItem(id, value)
}

function clearForm(formId) {
  $(formId).trigger('reset');
}

function inputValid(id) {
  const prop = $(id);
  if (prop.length == 0) {
    return false
  }
  return prop[0].validity.valid;
}

function check(id) {
  markValidity(id);
}

function sendForm(form) {
  console.log('Submitted form', form);
  fetch(form.url, {
    method: 'POST',
    body: form.data,
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then(response => response.json())
  .then(data => {
    clearForm('#' + form.id);
    alert('Thank you for your interest. We will be in touch shortly.');
  })
  .catch(err => alert(err));
}

function formErrors(inputs) {

  for (let i = 0; i < inputs.length; i++) {
    markValidity(inputs[i].id);
  }

  alert('Please check your form for errors.');
}