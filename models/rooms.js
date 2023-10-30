/* 
This is the model for the rooms
to query the result data like the room number, room type, etc.
*/
const pool = require("../config/db.js");

class Room {
  constructor(room) {
    this.id = id;
    this.number = number;
    this.type = type;
    this.status = status;
    this.capacity = capacity;
    this.price = price;
  }

  static async getById(id) {
    const [rows, fields] = await pool.execute(
      "SELECT * FROM rooms WHERE id = ?",
      [id]
    );
    return rows[0];

  }

  static async getMultipleByIds(ids) {
    const [rows, fields] = await pool.execute(
      "SELECT * FROM rooms WHERE id IN (?)",
      [ids]
    );
    return rows;
  }


  static async getAll() {
    // retrieve all room data from database
    // return an array of new Room objects with retrieved data
    const [rows, fields] = await pool.execute("SELECT * FROM rooms");
    return rows;
  }

  static async getByStatus(status) {
    // retrieve all room data from database
    // return an array of new Room objects with retrieved data
    const [rows, fields] = await pool.execute(
      "SELECT * FROM rooms WHERE status = ?",
      [status]
    );
    return rows;
  }

  static async getByType(type) {
    // retrieve all room data from database
    // return an array of new Room objects with retrieved data
    const [rows, fields] = await pool.execute(
      "SELECT * FROM rooms WHERE type = ?",
      [type]
    );
    return rows;
  }

  static async getAllAvailableRooms(checkin, checkout) {
    //Select all the room that not have a reservation in the date range of the checkin and checkout by reservation_rooms table in rooms table
    const [rows, fields] = await pool.execute(
      "SELECT * FROM rooms WHERE id NOT IN (SELECT room_id FROM reservation_rooms WHERE reservation_id IN (SELECT id FROM reservations WHERE check_in_date <= ? AND check_out_date > ?))",
      [checkout, checkin]
    );

    return rows;
  }


  static async getAllAvailableRoomsByType(checkin, checkout, type) {
    //Select all the room that not have a reservation in the date range of the checkin and checkout by reservation_rooms table in rooms table
    const [rows, fields] = await pool.execute(
      "SELECT * FROM rooms WHERE id NOT IN (SELECT room_id FROM reservation_rooms WHERE reservation_id IN (SELECT id FROM reservations WHERE check_in_date <= ? AND check_out_date > ?)) AND room_type = ?",
      [checkout, checkin, type]
    );

    return rows;
  }

  static async getAllTypeofRooms() {
    // retrieve all room data from database
    // return an array of new Room objects with retrieved data
    const [rows, fields] = await pool.execute(
      "SELECT DISTINCT room_type FROM rooms"
    );
    return rows;
  }
  

  async save() {
    // save/update room data to database
  }

  async delete() {
    // delete room data from database
  }

  async getBookings() {
    // retrieve all bookings associated with this room
    // return an array of Booking objects
  }

  static async getAllRoomsReserved(id) {
    //retrieve all rooms that are reserved by a reservation id
    //Get room number and room type
    const [rows, fields] = await pool.execute(
      "SELECT rooms.room_number, rooms.room_type FROM rooms INNER JOIN reservation_rooms ON rooms.id = reservation_rooms.room_id WHERE reservation_rooms.reservation_id = ?", [id]
    );
    console.log(rows)
    return rows;
  }


}
module.exports = Room;
