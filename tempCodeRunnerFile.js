const express = require('express');
const app = express();
const PORT = 3000;
const db = require('./db.js');
require('dotenv').config();

// Models (Optional but fine to keep if used here later)
const Person = require('./models/person.js');
const MenuItem = require('./models/menuItem.js');


//authentication part
const passport = require("passport"); //for authentication
const LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
passport.use(new LocalStrategy(async(USERNAME,password,done)=>{
    // authentication logic
    try{
        console.log('Recived Credentials:', USERNAME,password);
        // Step A: Check if the user exists in MongoDB
        const user = await Person.findOne({username : USERNAME});

        if(!user) 
            // If user is not found, return false with an error message
            return done(null , false, {message : "Incorrect username."});

        // Step B: Compare the incoming password with the hashed password in DB
        const isPasswordMatch =  user.password === password ? true : false;
        if(isPasswordMatch){
            // If everything matches, pass the user object forward
            return done(null, user);
        }
        else{
            return done(null,false, {message: 'Incorrect Password'});
        }

    }
    catch(err){
        // If a database crash or server error happens in the middle, pass the error
        return done(err);
    }
}));





// Middleware
app.use(express.json());  
app.use(express.urlencoded({extended: false}));  



// Base Root Route (Moved back here from personRoute)
app.get('/',(req, res) => {
    res.send("Welcome to my Hotel");
});

const localAuthMiddleware = passport.authenticate('local',{session: false});

// person Route
const personRoutes = require('./routes/personRoute.js'); //Import the router module from the specified file path
app.use('/person',localAuthMiddleware ,personRoutes);                        //Mount the router middleware to handle all incoming requests starting with the '/person' path prefix

// menuItem Route
const menuItemRoutes = require('./routes/menuItemRoutes.js');
app.use('/menu', menuItemRoutes);
  

app.listen(PORT, ()=>{
    console.log(`Server listen on port ${PORT}`);
});