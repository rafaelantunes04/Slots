var regbutton = document.getElementById('register');
var logbutton = document.getElementById('login');
var notifier = document.getElementById('notifier');

regbutton.addEventListener('click', function() {document.location='register.html'});
logbutton.addEventListener('click', start)

function start() {
    var data = {
        name: document.getElementById("name").value,
        password: document.getElementById("pass").value
    };
    // Validate the data on the client side
  if (data.name == "") {
    notifier.innerHTML = "You have to insert a name";
    return;
  }
  if (data.password.length < 7) {
    notifier.innerHTML = "Password must have more than 7 Characters";
    return;
  }
  
  // Make an HTTP request to the server to register the user
  fetch('/login', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(async response => {
    if (!response.ok) {
      throw new Error(`Request failed with status code: ${response.status}`);
    }
    const json = await response.json();
    if (json.status === 'success') {
      notifier.style = 'color:rgb(0, 255, 0);'
      notifier.innerHTML = 'Successfully logged in!';
      setTimeout(() => {
        window.location.assign('http://localhost:3000/slots.html');
      }, 3000);
    } else if (json.status === 'error') {
      notifier.innerHTML = json.message;
    }
  })
  .catch(error => {
    console.error('Error:', error);
    notifier.innerHTML = 'Error: ' + error;
  });
}