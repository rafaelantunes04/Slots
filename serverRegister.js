const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const mysqlinfo = require('./mysqlmodule')
const con = mysqlinfo.connection()

app.use(express.json());

app.post('/register',async (req, res) => {
  // Validate the data on the server side
  if (!req.body.name) {
    return res.status(400).json({ status: 'error', message: 'Name is required' });
  }
  if (req.body.password.length < 7) {
    return res.status(400).json({ status: 'error', message: 'Password must have more than 7 characters' });
  }
  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json({ status: 'error', message: 'Passwords must match' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
  // Insert the data into the database
con.query("USE accounts", function (err) {
  if (err) throw err;
    console.log("Using accounts");
});
  con.query("SELECT id FROM account WHERE id=(select max(id) from account)", function (err, result) {
    if (err) throw err;
      maxid = (JSON.parse(JSON.stringify(result)))[0].id + 1
      console.log("Variables set");
      info = [maxid, req.body.name, hashedPassword, 20];
      
      con.query("INSERT INTO account (id, name, password, money) VALUES (?, ?, ?, ?)", info, function (err, result){
        if (err) throw err;
          console.log("Number of records inserted: " + result.affectedRows);
          return res.json({ status: 'success' });
      });
    });
  });

app.get('/', (req, res) => {
  res.send('Go to http://localhost:3000/register.html');
});

app.use(express.static('public'));

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
