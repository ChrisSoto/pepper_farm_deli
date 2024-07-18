let INPUTS = [
  {
    id: 'full-name',
    required: true,
  },
  {
    id: 'e-mail',
    required: true,
  },
  {
    id: 'phone-number',
    required: false,
  },
  {
    id: 'event-date',
    required: true,
  },
  {
    id: 'no-of-guests',
    required: true,
  },
  {
    id: 'event-type',
    required: true,
  },
  {
    id: 'pickup',
    required: true,
  },
  {
    id: 'event-location',
    required: true,
  },
  {
    id: 'comments',
    required: false,
  }
];

window.onload = function() {
  function submitForm(event) {
    event.preventDefault();
    if (inputsValid(INPUTS)) {
      const formData = parseFormData('contact-form');
      sendForm(formData);
    } else {
      formErrors(INPUTS);
    }
  }

  $('#contact-submit').on('click', submitForm);
}

function parseFormData(formId) {
  const form = $('#' + formId);
  const formAction = document.getElementById(formId);
  const formData = form.serializeArray();
  let data = getContactData(formData);
  let url = formAction.action;
  data = JSON.stringify(data);

  // testing
  // let url = 'http://127.0.0.1:5001/imageonsd-af038/us-central1/addContact';
  
  return {
    id: formId,
    url,
    data,
  }
}

function getContactData(data) {
  let name = data[0].value;
  let email = data[1].value;
  let phone = data[2].value;
  let eventDate = data[3].value;
  let guests = data[4].value;
  let eventType = data[5].value;
  let pickup = data[6].value;
  let location = data[7].value;
  let comments = data[8].value;

  return {
    name,
    email,
    phone,
    eventDate,
    guests,
    eventType,
    pickup,
    location,
    comments
  };
}