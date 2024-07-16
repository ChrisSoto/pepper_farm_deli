window.onload = function() {
  const marquee = document.getElementById('marquee');
  if (marquee) {
    const marqueeContainer = document.getElementById('marquee-container');
    let containerWidth = marqueeContainer.offsetWidth;
    let textWidth = marquee.offsetWidth * 2;
    let pos = containerWidth;

    function scrollMarquee() {
      pos = pos - 5;
      if (pos < -textWidth) {
        pos = containerWidth;
      }
      marquee.style.transform = `translateX(${pos}px)`;
      requestAnimationFrame(scrollMarquee);
    }
    
    scrollMarquee();
  }

  $('')

  $('#contact-submit').on('click', submitForm);
}

// contact form
function sendForm(event) {
  const form = $('#contact-form');
  const formAction = document.getElementById('contact-form');
  const formData = form.serializeArray();

  let data = getData(formData);

  let url = formAction.action;
  data = JSON.stringify(data);
  // let url = 'http://127.0.0.1:5001/imageonsd-af038/us-central1/addContact';

  fetch(url, {
    method: 'POST',
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then(response => response.json())
  .then(data => {
    formSuccess = true;
    clearForm();
    alert('Thank you for your interest. We will be in touch shortly.');
  })
  .catch(err => alert(err));
}
// $('#contact-submit').on('click', sendForm);
function submitForm(event) {
  event.preventDefault();
  if (inputValid('#full-name') && inputValid('#e-mail') && inputValid('#project-details')) {
    sendForm(event);
  } else {
    alert('Please check your form for errors.');
  }
}

function clearForm() {
  $('#contact-form').trigger('reset');
}

function getData(data) {
  let name = data[0].value;
  let email = data[1].value;
  let phone = data[2].value;
  let details = data[3].value;
  
  if (!name) {
    name = localStorage.getItem('full-name');
  }
  if (!email) {
    email = localStorage.getItem('e-mail');
  }
  if (!phone) {
    phone = localStorage.getItem('phone-number');
  }
  if (!details) {
    details = localStorage.getItem('project-details');
  }

  return {
    name,
    email,
    phone,
    details,
    'site': 'pepperfarmdeli',
  };
}

function inputValid(id) {
  const prop = $(id);
  if (prop.length == 0) {
    return false
  }
  return prop[0].validity.valid;
}

function writeToLocalStorage(id) {
  var edValue = document.getElementById(id);
  var value = edValue.value;
  localStorage.setItem(id, value)
}