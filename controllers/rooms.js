const rooms = require("../models/rooms.js");
const reservations = require("../models/reservations.js");
const { WEB } = require("../config.js");

// exports.available = async (req, res) => {
//     const data = await rooms.getAvailableRooms();
//     res.status(200).json(data);
//     }

exports.checkAvailable = async (req, res) => {
    const data = await reservations.checkAvailable(req.body);
    res.status(200).json(data);
}

exports.getAllAvailable = async (req, res) => {
    const checkin = req.query.check_in;
    const checkout = req.query.check_out;
    const type = req.query.type;
    const data = await rooms.getAllAvailableRoomsByType(checkin, checkout, type);
    res.status(200).json(data);
}

