var express = require("express");
var router = express.Router();
const { WEB } = require("../config.js");

//Import user model
const User = require("../models/user.js");
const home = require("../models/home.js");
const reservations = require("../models/reservations.js");

router.get('/:id/checkin', async (req, res) => {
    const id = req.params.id;
    const data = await reservations.checkinById(id);
    res.status(200).json({ message: "Reservation checked in successfully" });
});

router.post('/', async (req, res) => {
    const data = await reservations.create(req.body).then((reservation) => {
        if (reservation == 'reservation already exists') {
            res.status(400).json({ message: "Reservation already exists" });
        }
    });
    res.status(200).json({ message: "Reservation created successfully" });
});

module.exports = router;