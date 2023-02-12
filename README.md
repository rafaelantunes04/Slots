# Slots
Slots Site

How to setup the program so you can host it:
1. Create a mysql database.
  -Create db with the name accounts;
  -Create table with name account and 4 columns (id: int/ name: varchar(255)/ password: varchar(255)/money: int).

2. Change settings of the program (mysqlmodule.js).
  -Put your db credentials so the program can access the db.

3. Start the server.
  -Open the console;
  -Go to the folder location of the program (cd <folder location>);
  -Write 'node NodejsServer.js'.

12/02/2023
  -Program working fine with money exchanges
  
  Future insights but not prioritized:
    -Use jwt to more security;
    -Use google login funcionality (this having to change to use mails);
      -After changing to mails do the change password funcionality;
    -Ask for a stronger password when registering;
    -After trying x times when trying to log in put the user in a cooldown;
    -Styling the Site;
    -Change the slots to be more complex.
    
