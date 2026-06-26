const express = require('express');
const router = express.Router();
const person = require('./../models/person');

// Route-1: POST method to create a new person
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        if (!body || !body.name || !body.email || !body.work || !body.username || !body.password) {
            return res.status(400).json({ msg: "All fields are required..." });
        }

        const newPerson = new person(body);
        const savedPerson = await newPerson.save();
        res.status(201).json({ msg: "Person saved successfully!", data: savedPerson });
    } catch (err) {
        console.log("Error occurred in saving new person:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route-2: GET method to fetch all people
router.get('/', async (req, res) => {
    try {
        const data = await person.find();
        console.log('data fetched');
        res.status(200).json(data); 
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route-3: GET method to filter by workType
router.get('/:workType', async (req, res) => {
    try {
        const workType = req.params.workType;
        if (workType == 'chef' || workType == 'manager' || workType == 'waiter') {
            const response = await person.find({ work: workType });
            console.log('response fetched');
            res.status(200).json(response);
        } else {
            res.status(404).json({ error: 'Invalid work type' });
        }
    } 
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;