// Members
const members = ['VICTORIA CHAMBERS', 'DALE BYRD', 'DAWN WOOD', 'DAN OLIVER'];

// Notifications & Alerts
const notification = document.querySelector('#notification');
const notificationAlert = notification.querySelector('.notification-alert');
const notificationMessage = document.querySelectorAll('.notification-message');
const closeAlert = document.querySelector('.close-alert');

// // Autocomplete & Messaging
const search = document.querySelector('#search-user');
const validUser = document.querySelector('#username');
const message = document.querySelector('#message');
const messageForm = document.querySelector('#message-user form');

// Settings
const settingsForm = document.querySelector('#settings form');
const emailNotif = document.getElementById('email-notification');
const privacy = document.getElementById('privacy-setting');
const timezone = document.getElementById('time');
const reset = document.getElementById('reset');

// Autocomplete Function
function autocomplete(inp, arr) {
  /* the autocomplete function takes two arguments,the text field element and an array of possible autocompleted values: */
  let currentFocus;
  /* execute a function when someone writes in the text field: */
  inp.addEventListener('input', function(e) {
    // eslint-disable-next-line one-var
    let a,
      b,
      i,
      val = this.value;
    /* close any already open lists of autocompleted values */
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /* create a DIV element that will contain the items (values): */
    a = document.createElement('DIV');
    a.setAttribute('id', `${this.id}autocomplete-list`);
    a.setAttribute('class', 'autocomplete-items');
    /* append the DIV element as a child of the autocomplete container: */
    this.parentNode.appendChild(a);

    /* for each item in the array... */
    for (let i = 0; i < arr.length; i++) {
      /* check if the item starts with the same letters as the text field value: */
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /* create a DIV element for each matching element: */
        b = document.createElement('DIV');
        /* make the matching letters bold: */
        b.innerHTML = `<strong>${arr[i].substr(0, val.length)}</strong>`;
        b.innerHTML += arr[i].substr(val.length);
        /* insert a input field that will hold the current array item's value: */
        b.innerHTML += `<input type='hidden' value='${arr[i]}'>`;
        /* execute a function when someone clicks on the item value (DIV element): */
        b.addEventListener('click', function(e) {
          /* insert the value for the autocomplete text field: */
          inp.value = this.getElementsByTagName('input')[0].value;
          /* close the list of autocompleted values,
              (or any other open lists of autocompleted values: */
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /* execute a function presses a key on the keyboard: */
  inp.addEventListener('keydown', function(e) {
    let x = document.getElementById(`${this.id}autocomplete-list`);
    if (x) x = x.getElementsByTagName('div');
    if (e.keyCode == 40) {
      /* If the arrow DOWN key is pressed, increase the currentFocus constiable: */
      currentFocus++;
      /* and and make the current item more visible: */
      addActive(x);
      // } else if (e.keyCode == 38) { //up
      /* If the arrow UP key is pressed, decrease the currentFocus constiable: */
      currentFocus--;
      /* and and make the current item more visible: */
      addActive(x);
    } else if (e.keyCode == 13) {
      /* If the ENTER key is pressed, prevent the form from being submitted, */
      e.preventDefault();
      if (currentFocus > -1) {
        /* and simulate a click on the "active" item: */
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /* a function to classify an item as "active": */
    if (!x) return false;
    /* start by removing the "active" class on all items: */
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /* add class "autocomplete-active": */
    x[currentFocus].classList.add('autocomplete-active');
  }
  function removeActive(x) {
    /* a function to remove the "active" class from all autocomplete items: */
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove('autocomplete-active');
    }
  }
  function closeAllLists(elmnt) {
    /* close all autocomplete lists in the document, except the one passed as an argument: */
    const x = document.getElementsByClassName('autocomplete-items');
    for (let i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /* execute a function when someone clicks in the document: */
  document.addEventListener('click', function(e) {
    closeAllLists(e.target);
  });
}

autocomplete(search, members);

// Event Listeners
// Notifications & Alerts
notification.addEventListener('click', () => {
  notificationAlert.remove();
  notificationMessage.forEach(element => {
    element.style.display = 'grid';
    const closeNotification = element.lastElementChild;
    closeNotification.addEventListener('click', e => {
      e.target.parentNode.remove();
    });
  });
});

closeAlert.addEventListener('click', e => {
  e.target.parentNode.remove();
});

// Form Validation
messageForm.addEventListener('submit', e => {
  const success = document.querySelector('#success');
  if (
    members.indexOf(search.value.toUpperCase()) === -1 &&
    message.value === ''
  ) {
    search.className = 'invalid';
    message.className = 'invalid';
    validUser.className = 'error';
    validUser.innerHTML = 'Please enter required fields';
    e.preventDefault();
  } else if (members.indexOf(search.value.toUpperCase()) === -1) {
    search.className = 'invalid';
    validUser.className = 'error';
    validUser.innerHTML = 'Please enter required fields';
    e.preventDefault();
  } else if (message.value === '' || message.value === ' ') {
    message.className = 'invalid';
    validUser.className = 'error';
    validUser.innerHTML = 'Please enter required fields';
    e.preventDefault();
  } else {
    search.className = 'valid';
    message.className = 'valid';
    validUser.className = 'hide-message';
    success.style.visibility = 'visible';
    success.innerHTML =
      "<p class='success-message'>Your message has been sent <span class='close-success'>&times;</span></p>";
    search.value = '';
    message.value = '';
    e.preventDefault();
    const closeSuccess = document.querySelector('.close-success');
    closeSuccess.addEventListener('click', function(e) {
      success.style.visibility = 'hidden';
      e.target.parentNode.remove();
    });
  }
});

// Settings
const supportsLocalStorage = () => {
  try {
    return 'localStorage' in window && window.localStorage !== null;
  } catch (e) {
    return false;
  }
};

const getSettings = () => {
  const preferredSettings = localStorage.getItem('settingItems');
  if (preferredSettings) {
    return JSON.parse(preferredSettings);
  }
  return [];
};

const saveSettings = str => {
  const preferredSettings = getSettings();
  preferredSettings.push(str);
  localStorage.setItem('settingItems', JSON.stringify(preferredSettings));
};

function resetSettings() {
  localStorage.removeItem('settingItems');
}

window.onload = () => {
  if (supportsLocalStorage()) {
    const settings = getSettings();
    emailNotif.checked = settings[0];
    privacy.checked = settings[1];
    timezone.value = settings[2];

    settingsForm.addEventListener('submit', () => {
      resetSettings();
      saveSettings(emailNotif.checked);
      saveSettings(privacy.checked);
      saveSettings(timezone.value);
    });

    reset.addEventListener('click', () => {
      resetSettings();
      saveSettings(true);
      saveSettings(true);
      saveSettings('Select Timezone');
    });
  }
};
