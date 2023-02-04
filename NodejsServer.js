const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const mysqlinfo = require('./mysqlmodule')
const con = mysqlinfo.connection()
function randomSymbol() {
  switch(Math.floor(Math.random() * 10)) { // 0-9
      case 0:
        return "🍓";
      case 1:
        return "🍌";
      case 2:
        return "🌰";
      case 3:
        return "🥨";
      case 4:
        return "🍒"
      case 5:
        return "🍨";
      case 6:
        return "🥩";
      case 7:
        return "🥐";
      case 8:
        return "🍚";
      case 9:
        return "🥞";
  };
};

app.use(express.json());

app.post('/slots', async (req, res) => {
  let dbmoney = 0;
  con.query("USE accounts");
  con.query("SELECT money FROM account WHERE name = ?", [req.body.name], (err, data) => {
    dbmoney = data[0].money
    if (dbmoney == 0) {
      con.query("UPDATE account SET money = 10 WHERE name = ?", [req.body.name])
        con.query("SELECT money FROM account WHERE name = ?", [req.body.name], (err, data) => {
          if (err) throw err
          dbmoney = data[0].money
          console.log(req.body.name + " just got his account reset")
          return res.status(400).json({ status:'error', message: 'Your money has been reset because you ran out of money', money: dbmoney});
        });
    }
    else {
      if (req.body.money > dbmoney) {
        return res.status(400).json({ status:'error', message: 'You dont have that much money in your account', money: dbmoney});
      }
      if (req.body.money <= 0) {
        return res.status(400).json({ status:'error', message: 'You have to bet a higher value', money: dbmoney});
      }
      else {
        let y1 = randomSymbol();
        let y2 = randomSymbol();
        let y3 = randomSymbol();
        let newmoney = 0;
        let message = "";
        if (y1 == y2 && y2 == y3) {
          newmoney = (req.body.money * 5);
          message = "+" + newmoney + " €";
        } 
        if (y1 !== y2 && y2 !== y3 && y1 !== y3) {
          newmoney = -req.body.money
          message = (newmoney) + " €";
        }
        else {
          newmoney = (req.body.money * 2)
          message = "+" + newmoney + " €";
        }
        con.query("UPDATE account SET money = ? WHERE name = ?", [ (data[0].money + newmoney), req.body.name ], (err) => {
          if (err) throw err
        });
        console.log(req.body.name + " -> " + newmoney)
        return res.status(200).json({ status:'success', message: message, money: (data[0].money + newmoney), a: y1, b: y2, c: y3 })
      }
    }
  });
});

app.post('/register', async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ status: 'error', message: 'Name is required' });
  }
  if (req.body.password.length < 7) {
    return res.status(400).json({ status: 'error', message: 'Password must have more than 7 characters' });
  }
  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json({ status: 'error', message: 'Passwords must match' });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  con.query("USE accounts", function (err) {
    if (err) throw err
  });

  con.query("SELECT * FROM account WHERE name = ?", [req.body.name], async (err, result) => {
    if (err) throw err;
      console.log(err)

    if (result.length > 0) {
      return res.status(400).json({ status: 'error', message: 'Name already exists, please use another name' });
    } 
    else {
      con.query("USE accounts", function (err) {
        if (err) throw err
      })

      con.query("SELECT id FROM account WHERE id=(select max(id) from account)", function (err, result) {
        if (err) throw err;
        maxid = (JSON.parse(JSON.stringify(result)))[0].id + 1
        info = [maxid, req.body.name, hashedPassword, 20];
      

      con.query("INSERT INTO account (id, name, password, money) VALUES (?, ?, ?, ?)", info, function (err, result){
        if (err) throw err;
          console.log(req.body.name + " Just Got Registered");
          return res.json({ status: 'success' });
        });
      });
    };
  });
});

app.post('/login', async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ status: 'error', message: 'Name is required' });
  }
  else if (req.body.password.length < 7) {
    return res.status(400).json({ status: 'error', message: 'Password must have more than 7 characters' });
  }
  else {
    con.query("USE accounts", function (err) {
      if (err) throw err;
    });
  
    con.query("SELECT name, password, money FROM account WHERE name = ?", [req.body.name], (err, data) => {
      if (err) {
        console.log(err);
      } 
      else {
        if (data.length > 0) {
          if (bcrypt.compare(req.body.password, data[0].password)) {
            console.log(req.body.name + " just logged in")
            return res.status(200).json({ status: 'success', message: 'Login successful', money: data[0].money });
          }
          else {
            return res.status(401).json({ status: 'error', message: 'Incorrect password' });
          }
        }
        else {
          return res.status(401).json({ status: 'error', message: 'Incorrect name' });
        }
      };
    });
  }
});

app.get('/', (req, res) => {
  res.redirect('/login.html');
});

app.use(express.static('public'));

app.listen(3000, () => {
  console.log("Server up'n running in port 3000");
});
