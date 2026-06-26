const express = require('express');
const router = express.Router();

const MenuItem = require('../models/menuItem'); 

// Route-1: GET method to fetch all menu items from DB
router.get('/', async (req, res) => {
    try {
        const data = await MenuItem.find();
        console.log('menu data fetched');
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route-2: POST method to create a menu item
router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const newItem = new MenuItem(data);
        const response = await newItem.save();
        console.log('data saved');
        res.status(200).json(response);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;