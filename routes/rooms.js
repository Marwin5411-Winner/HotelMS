var express = require("express");
var router = express.Router();
const { WEB } = require("../config.js");

//Import user model
const User = require("../models/user.js");
const home = require("../models/home.js");
const reservations = require("../models/reservations.js");
const rooms = require("../models/rooms.js");

//Import Controller
const roomsController = require("../controllers/rooms.js");

// router.get("/available", roomsController.che);
router.get("/available", roomsController.getAllAvailable);

module.exports = router;
