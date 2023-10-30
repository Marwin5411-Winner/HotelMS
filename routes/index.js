var express = require("express");
var router = express.Router();
const { WEB } = require("../config.js");
//Import user model
const User = require("../models/user.js");
const home = require("../models/home.js");
const reservations = require("../models/reservations.js");
const rooms = require("../models/rooms.js");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/login", function (req, res, next) {
  res.render("login", { title: "Login", WEB: WEB });
});

//Authenticating the user
router.post("/login", function (req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  User.findByEmail(email).then((user) => {
    if (user) {
      User.comparePassword(password, user.password).then((match) => {
        if (match) {
          req.session.user = user;
          res.redirect("/dashboard");
        } else {
          res.redirect("/login");
        }
      });
    } else {
      res.redirect("/login");
    }
  });
});

router.post("/register", function (req, res, next) {
  var name = req.body.name;
  var password = req.body.password;
  var email = req.body.email;
  User.create({ name, email, password }).then((user) => {
    // res.redirect("/login");
    res.status(200).json({ message: "User created successfully" });
  });
});

router.get("/logout", function (req, res, next) {
  req.session.destroy();
  res.redirect("/login");
});

router.get("/dashboard", async function (req, res, next) {
  var page = req.query.page || "home";
  var action = req.query.action || "view";

  var data = {};
  switch (page) {
    case "home":
      data = {
        active_rooms: await home.getActiveRooms(),
        total_reservations_today: await home.getReservationsToday(),
        uncleaned_rooms: await home.getUncleanedRooms(),
        available_rooms: await home.getAvailableRooms(),
        staff_active: 0,
        open_maintenance_requests: 0,
        remaining_checkins_today: await home.getUpcomingCheckins(),
      };
      break;
    case "booking":
      data = {
        reservations: await reservations.getAll(),
        today: WEB.today,
      };
      console.log(data.today)
      break;
    case "rooms":
      data = {
        rooms: await home.getAllRooms(),
      };
      break;
    case "staff":
      data = {
        staff: await home.getAllStaff(),
      };
      break;
    case "checkin":
      data = {
        reservations: await reservations.getReservationById(req.query.id),
        rooms: await rooms.getAllRoomsReserved(req.query.id),
        today: WEB.today,
      };
      break;
    case "checkout":
      data = {
      };
      break;
    case 'reservation':
      data = {
        // rooms: await rooms.getAvailableRooms(),
        type_of_room: await rooms.getAllTypeofRooms(),
      };
      break;
  }
  if (req.session) {
    if (req.session.user) {
      res.render("dashboard", {
        title: WEB.dashboard.title,
        WEB: WEB,
        page: page,
        user: req.session.user,
        data: data,
        action: action,
      });
    } else {
      res.redirect("/login");
    }
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
