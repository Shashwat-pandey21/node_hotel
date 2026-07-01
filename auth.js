const passport = require("passport"); //for authentication
const LocalStrategy = require('passport-local').Strategy;

const Person = require('./models/person');

// Configure Passport Local Strategy
passport.use(new LocalStrategy(async(USERNAME,password,done)=>{
    // authentication logic
    try{
        //console.log('Recived Credentials:', USERNAME,password);
        // Step A: Check if the user exists in MongoDB
        const user = await Person.findOne({username : USERNAME});

        if(!user) 
            // If user is not found, return false with an error message
            return done(null , false, {message : "Incorrect username."});

      // Step B: Compare the incoming password with the hashed password in DB
      const isPasswordMatch = await user.comparePassword(password);
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

module.exports = passport;