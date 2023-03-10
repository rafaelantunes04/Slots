var button = document.getElementById("register");
var notifier = document.getElementById("notifier");
button.addEventListener('click', start);


function start() {
  var data = {
    name: document.getElementById("name").value,
    password: document.getElementById("pass0").value,
    confirmPassword: document.getElementById("pass1").value
  };
  
  if (data.name == "") {
    notifier.innerHTML = "You have to insert a name";
    return;
  }
  if (data.password.length < 7) {
    notifier.innerHTML = "Password must have more than 7 Characters";
    return;
  }
  if (data.password !== data.confirmPassword) {
    notifier.innerHTML = "Passwords must match";
    return;
  }
  
  fetch('/register', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(response => {
    if (response.status === 'success') {
      notifier.innerHTML = 'Successfully registered, Redirecting';
      notifier.style = 'color:rgb(0, 255, 0);'
      setTimeout(() => {
        window.location.assign('http://localhost:3000/login.html');
    }, 3000);
    } else {
      notifier.innerHTML = 'Error: ' + response.message;
    }
  })
  .catch(error => {
    console.error('Error:', error);
    notifier.innerHTML = 'Error: ' + error;
  });
}
