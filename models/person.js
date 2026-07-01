const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the Person schema
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age:{
        type: Number
    },
    work:{
        type: String,
        enum: ['chef', 'waiter', 'manager'],
        required: true
    },
    mobile:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    address:{
        type: String
    },
    salary:{
        type: Number,
        required: true
    },
    username: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    }
});


// 🔒 1. Pre-save hook: Hashes the password automatically before saving to MongoDB
 personSchema.pre('save', async function(next){
    const person = this;

    // Hash the password only if it has been modified (or is new)
    if(!person.isModified('password')) return next();

    try{
        // hash password generation :- Generate a salt factor (10 rounds is the industry standard)
        const salt = await bcrypt.genSalt(10);

       // Hash the password using the generated salt 
        const hashedPassword = await bcrypt.hash(person.password, salt);
        
        // Override the plain password with the hashed one
        person.password = hashedPassword;
        next();
    }
    catch(err){
        return next(err);
    }
})

// 🔑 2. Custom Method: Compares incoming login password with the hashed DB password
personSchema.methods.comparePassword = async function(candidatePassword){
    try{
        // Use bcrypt to compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    }
    catch(err){
        throw err;
    }
}

// Create Person model
const Person = mongoose.model('Person', personSchema);
module.exports = Person;