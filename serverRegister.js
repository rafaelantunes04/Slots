const fs = require('fs');
const http = require('http');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const mysqlinfo = require('./mysqlmodule')
const con = mysqlinfo.connection()

app.use(express.json());

app.post('/register',async (req, res) => {
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
  
  // Insert the data into the database
  con.query("USE accounts", function (err) {
  if (err) throw err
});
  con.query("SELECT * FROM account WHERE name = ?", [req.body.name], async (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      return res.status(400).json({ status: 'error', message: 'Name already exists, please use another name' });
    } else {
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
  if (req.body.password.length < 7) {
    return res.status(400).json({ status: 'error', message: 'Password must have more than 7 characters' });
  }

  con.query("USE accounts", function (err) {
    if (err) throw err;
  });

  con.query("SELECT name, password FROM account WHERE name = ?", [req.body.name], (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({ status: 'error', message: 'Error retrieving data' });
    } else {
      if (data.length > 0) {
        // Compare the hashed password stored in the database with the input password
        bcrypt.compare(req.body.password, data[0].password, (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({ status: 'error', message: 'Error comparing passwords' });
          } else {
            if (result) {
              res.status(200).json({ status: 'success', message: 'Login successful' });
            } else {
              res.status(401).json({ status: 'error', message: 'Incorrect password' });
            }
          }
        });
      } else {
        res.status(401).json({ status: 'error', message: 'Incorrect username' });
      }
    }
  });
});

app.get('/', (req, res) => {
  res.redirect('/login.html');
});

app.use(express.static('public'));

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
