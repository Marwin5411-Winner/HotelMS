/* 
This is the model for the reservations
to query the result data like the reservation number, room number, etc.
*/
const pool = require("../config/db.js");
const moment = require("moment");
class Reservation {
  constructor({ roomId, guestName, startDate, endDate, numGuests }) {
    this.roomId = roomId;
    this.guestName = guestName;
    this.startDate = startDate;
    this.endDate = endDate;
    this.numGuests = numGuests;
  }

  static async getAll() {
    const [rows, fields] = await pool.execute(
      "SELECT reservations.id, reservations.reservation_guest_name, reservations.check_in_date, reservations.check_out_date, reservations.num_of_guests, reservations.status FROM reservations order by reservations.id desc"
    );
    console.log(rows)
    rows.map((row) => {
      row.check_in_date = moment(row.check_in_date).format("M/D/YYYY");
      row.check_out_date = moment(row.check_out_date).format("M/D/YYYY");
    });
    // for (let i = 0; i < rows.length; i++) {
    //   rows[i].guests = [];
    //   rows[i].room_id = rows[i].room_id.split(",");
    //   rows[i].room_number = [];
    //   if (rows[i].room_id.length > 1) {
    //     for (let j = 0; j < rows[i].room_id.length; j++) {
    //       const [rowsRoom, fieldsRoom] = await pool.execute(
    //         "SELECT * FROM rooms WHERE id = ?",
    //         [rows[i].room_id[j]]
    //       );
    //       rows[i].room_number.push(rowsRoom[0].room_number);
    //     }
    //   } else {
    //     const [rowsRoom, fieldsRoom] = await pool.execute(
    //       "SELECT * FROM rooms WHERE id = ?",
    //       [rows[i].room_id[0]]
    //     );
    //     rows[i].room_number = rowsRoom[0].room_number;
    //   }
    // }
    return rows;
  }

  static async checkoutById(id) {
    const [rows, fields] = await pool.execute(
      "UPDATE reservations SET status = 'checked_out' WHERE id = ?",
      [id]
    );
    return rows;
  }

  static async getReservationById(id) {
    const [rows, fields] = await pool.execute(
      "SELECT * FROM reservations WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  static async getReservationByRoomId(id) {
    const [rows, fields] = await pool.execute(
      "SELECT * FROM reservations WHERE room_id = ?",
      [id]
    );
    return rows;
  }

  static async create (reservation) {
    //Check if the reservation is existing
    const [rowsCheck, fieldsCheck] = await pool.execute(
      "SELECT * FROM reservations WHERE reservation_guest_name = ? AND check_in_date = ? AND check_out_date = ? AND num_of_guests = ? AND reservation_address = ? AND reservation_phone = ?",
      [reservation.booking_name, reservation.check_in, reservation.check_out, reservation.number_of_guest, reservation.address, reservation.phone]
    );
    if (rowsCheck.length > 0) {
      return 'reservation already exists';
    }

    const [rows, fields] = await pool.execute(
      "INSERT INTO reservations (reservation_guest_name, check_in_date, check_out_date, num_of_guests, reservation_address, reservation_phone, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        reservation.booking_name,
        reservation.check_in,
        reservation.check_out,
        reservation.number_of_guest,
        reservation.address,
        reservation.phone,
        "upcoming",
      ]
    );
    reservation.room_number = reservation.room_number.split(",");
    console.log(reservation.room_number);
    for (let i = 0; i < reservation.room_number.length; i++) {
      if (reservation.room_number[i] === "") {
        continue;
      }
      const [rowsRoom, fieldsRoom] = await pool.execute(
        "INSERT INTO reservation_rooms (reservation_id, room_id) VALUES (?, ?)",
        [rows.insertId, reservation.room_number[i]]
      );
    }
    return rows;
  }

  static async checkinById(id) {
    const [rows, fields] = await pool.execute(
      "UPDATE reservations SET status = 'checked_in' WHERE id = ?",
      [id]
    );
    return rows;
  }

}

module.exports = Reservation;
