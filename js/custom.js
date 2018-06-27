// Members
var members = ['VICTORIA CHAMBERS', 'DALE BYRD', 'DAWN WOOD', 'DAN OLIVER'];

// Notifications & Alerts
var notification = document.getElementById('notification');
var notificationAlert = document.getElementsByClassName('notification-alert');
var notificationMessage = document.getElementsByClassName('notification-message');
var closeNotification = document.getElementsByClassName('close');
var closeAlert = document.getElementsByClassName('close-alert');

// Autocomplete & Messaging
var search = document.getElementById('search-user');
var validUser = document.getElementById('username');
var message = document.getElementById('message');
var messageForm = document.getElementsByTagName('form')[0];
var success = document.getElementById('success');
var closeSuccess = document.getElementsByClassName('close-success');

// Settings
var settingsForm = document.getElementsByTagName('form')[1];
var emailNotif = document.getElementById('email-notification');
var privacy = document.getElementById('privacy-setting');
var timezone = document.getElementById('time');
var reset = document.getElementById('reset');

// Close Notifications Function
function closeNotif(a) {
  for (var i = 0; i < a.length; i++) {
    a[i].addEventListener('click', function() {
        this.parentNode.remove();
    });
  }
}

// Autocomplete Function
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e)
{closeAllLists(e.target)});
}

autocomplete(search, members);
closeNotif(closeAlert);

// Event Listeners
  // Notifications & Alerts
  notification.addEventListener("click", () => {
    if (notificationAlert[0]) {
      notificationAlert[0].remove();
    }
    for (var i = 0; i < notificationMessage.length; i++) {
      if (notificationMessage[i].style.display === "none" || notificationMessage[i].style.display === "") {
        notificationMessage[i].style.display = "grid";
        closeNotif(closeNotification);
      } else {
        notificationMessage[i].style.display = "none";
      }
    }
  });

  // Form Validation
  messageForm.addEventListener("submit", (e) => {
    if (members.indexOf(search.value.toUpperCase()) === -1 && message.value === "") {
      search.className = "invalid";
      message.className = "invalid";
      validUser.className = "error";
      validUser.innerHTML = "Please enter required fields";
      e.preventDefault();
    } else if (members.indexOf(search.value.toUpperCase()) === -1) {
      search.className = "invalid";
      validUser.className = "error";
      validUser.innerHTML = "Please enter required fields";
      e.preventDefault();
    } else if (message.value === "" || message.value === " ") {
      message.className = "invalid";
      validUser.className = "error";
      validUser.innerHTML = "Please enter required fields";
      e.preventDefault();
    } else {
        search.className = "valid";
        message.className = "valid";
        validUser.className = "hide-message";
        success.style.visibility = "visible";
        success.innerHTML = "<p class='success-message'>Your message has been sent <span class='close-success'>&times;</span></p>";
        search.value = "";
        message.value = "";
        e.preventDefault();
        closeNotif(closeSuccess);
      }
    });

// Settings
function supportsLocalStorage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null
  } catch(e) {
    return false;
  }
}

function getSettings() {
  var preferredSettings = localStorage.getItem('settingItems');
  if (preferredSettings) {
    return JSON.parse(preferredSettings);
  } else {
    return [];
  }
}

function saveSettings(str) {
  var preferredSettings = getSettings();
  preferredSettings.push(str);
  localStorage.setItem('settingItems', JSON.stringify(preferredSettings));
}

function resetSettings() {
  localStorage.removeItem('settingItems');
}

window.onload = function() {
  if (supportsLocalStorage()) {
    var settings = getSettings();
      emailNotif.checked = settings[0];
      privacy.checked = settings[1];
      timezone.value = settings[2];

    settingsForm.addEventListener("submit", () => {
      resetSettings();
      saveSettings(emailNotif.checked);
      saveSettings(privacy.checked);
      saveSettings(timezone.value);
    });

    reset.addEventListener("click", () => {
      resetSettings();
      saveSettings(true);
      saveSettings(true);
      saveSettings("Select Timezone");
    });
  };
};
