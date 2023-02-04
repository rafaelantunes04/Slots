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

  if (data.name == "") {
    notifier.innerHTML = "You have to insert a name";
    return;
  }
  if (data.password.length < 7) {
    notifier.innerHTML = "Password must have more than 7 Characters";
    return;
  }
  
  fetch('/login', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(async response => {
    const json = await response.json();
    if (json.status === 'success') {
      notifier.style = 'color:rgb(0, 255, 0);';
      notifier.innerHTML = 'Successfully logged in!';
      sessionStorage.setItem("name", data.name);
      sessionStorage.setItem("money", json.money);
      setTimeout(() => {
        window.location.assign('http://localhost:3000/slots.html');
      }, 3000);
    } 
    else if (json.status === 'error') {
      notifier.style = 'color:rgb(255, 0, 0)';
      notifier.innerHTML = json.message;
    }
  })
  .catch(error => {
    console.error('Error:', error);
    notifier.innerHTML = 'Error logging in: ' + error;
  });
}