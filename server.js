const express = require('express');
const app = express();
const PORT = 3000;
const db = require('./db.js');

// Models (Optional but fine to keep if used here later)
const person = require('./models/person.js');
const MenuItem = require('./models/menuItem.js');

// Middleware
app.use(express.json());  
app.use(express.urlencoded({extended: false}));  

// Base Root Route (Moved back here from personRoute)
app.get('/', (req, res) => {
    res.send("Welcome to my Hotel");
});

// person Route
const personRoutes = require('./routes/personRoute.js'); //Import the router module from the specified file path
app.use('/person', personRoutes);                        //Mount the router middleware to handle all incoming requests starting with the '/person' path prefix

// menuItem Route
const menuItemRoutes = require('./routes/menuItemRoutes.js');
app.use('/menu', menuItemRoutes);
  

app.listen(PORT, ()=>{
    console.log(`Server listen on port ${PORT}`);
});