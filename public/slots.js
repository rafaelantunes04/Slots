var notifier = document.getElementById('notifier');
var textmoney = document.getElementById('money');
var textname = document.getElementById('name');
var button = document.getElementById('button');
var cooldown = 0
textname.innerHTML = 'Hello ' + sessionStorage.getItem('name')
textmoney.innerHTML = 'Money: ' + sessionStorage.getItem('money'); + "€"


button.addEventListener('click', start);



function start() {
  var data = {
    name: sessionStorage.getItem('name'),
    money: parseInt(document.getElementById('betmoney').value)
  };

  if (cooldown == 1) {
    notifier.style = 'color:rgb(255, 0, 0)';
    notifier.innerText = "In cooldown";
  }
  else if (Number.isInteger(data.money) == false) {
    cooldown = 1;
    notifier.innerText = "Needs to be a exact number";
    setTimeout(() => {
      notifier.innerHTML = "";
      cooldown = 0;
    }, 2000);
  }
  else if (data.money > sessionStorage.getItem('money')) {
    cooldown = 1;
    notifier.innerHTML = "You dont have enough money";
    setTimeout(() => {
      notifier.innerHTML = "";
      cooldown = 0;
    }, 2000);
  }
  else if (data.money < 0){
    cooldown = 1;
    notifier.innerHTML = "You have to bet a higher value!";
    setTimeout(() => {
      notifier.innerHTML = "";
      cooldown = 0;
    }, 2000);
  }
  else {
    fetch('/slots', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(async response => {
      const json = await response.json();
      if (json.status === 'success') {
        notifier.style = 'color:rgb(255, 255, 0);';
        sessionStorage.setItem("money", json.money);
        textmoney.innerHTML = 'Money: ' + json.money + " €";
        notifier.innerHTML = json.message;
        cooldown = 1
        setTimeout(() => {
          notifier.style = 'color:rgb(255, 0, 0)';
          notifier.innerHTML = "";
          cooldown = 0;
        }, 1000);
        document.getElementById('y').innerHTML = json.a + json.b + json.c
      }
      if (json.status === 'error') {
        sessionStorage.setItem("money", json.money);
        textmoney.innerHTML = 'Money: ' + json.money + " €";
        notifier.innerHTML = json.message;
        setTimeout(() => {
          notifier.innerHTML = ""
        }, 3000);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      notifier.innerHTML = 'Error logging in: ' + error;
    });
  };
}