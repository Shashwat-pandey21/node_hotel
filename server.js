const express = require('express');
const app = express();
const PORT = 3000;
const db = require('./db.js');
require('dotenv').config();

// Models (Optional but fine to keep if used here later)
const Person = require('./models/person.js');
const MenuItem = require('./models/menuItem.js');


 //for authentication
const passport = require("./auth.js");
app.use(passport.initialize());



// Middleware
app.use(express.json());  
app.use(express.urlencoded({extended: false}));  




const localAuthMiddleware = passport.authenticate('local',{session: false});

// Base Root Route (Moved back here from personRoute)
app.get('/',(req, res) => {
    res.send("Welcome to my Hotel");
});


// person Route
const personRoutes = require('./routes/personRoute.js'); //Import the router module from the specified file path
app.use('/person',localAuthMiddleware ,personRoutes);                        //Mount the router middleware to handle all incoming requests starting with the '/person' path prefix

// menuItem Route
const menuItemRoutes = require('./routes/menuItemRoutes.js');
app.use('/menu', menuItemRoutes);
  

app.listen(PORT, ()=>{
    console.log(`Server listen on port ${PORT}`);
});







//app.use() means "Hey Express, apply this rule or feature to my server from now on."