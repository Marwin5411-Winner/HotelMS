/* 
This is the model for the dashboard
to query the result data like the number of rooms, number of customers, etc.  
*/
const pool = require("../config/db.js");

class Dashboard {

    //Get number of active rooms
    static async getActiveRooms() {
        const [rows, fields] = await pool.execute(
            "SELECT COUNT(*) AS active_rooms FROM rooms WHERE status = ?", ['occupied']
        );
        return rows[0].active_rooms;
    }

    //Total reservations for the day (today)
    static async getReservationsToday() {
        const [rows, fields] = await pool.execute(
            "SELECT COUNT(*) AS reservations_today FROM reservations WHERE DATE(created_at) = CURDATE()"
        );
        return rows[0].reservations_today;
    }

    //Uncleaned rooms for the day (today)
    static async getUncleanedRooms() {
        const [rows, fields] = await pool.execute(
            "SELECT COUNT(*) AS uncleaned_rooms FROM rooms WHERE status = ?" , ['uncleaned']
        );
        return rows[0].uncleaned_rooms;
    }

    //Total checkout for the day (today)
    static async getCheckoutsToday() {
        const [rows, fields] = await pool.execute(
            "SELECT COUNT(*) AS checkouts_today FROM reservations WHERE DATE(check_out_date) = CURDATE()"
        );
        return rows[0].checkouts_today;
    }

    //Remaining checkouts for the day (today)
    static async getRemainingCheckoutsToday() {
        const [rows, fields] = await pool.execute(
            "SELECT COUNT(*) AS remaining_checkouts_today FROM reservations WHERE DATE(check_out_date) = CURDATE() AND status = 'checked_in''"
        );
        return rows[0].remaining_checkouts_today;
    }

    //Remaining check in for the day (today)
    //get all data from reservations table where check_in_date = today and status = upcoming
    //get room number from rooms table via room_id in reservations table
    //for loop guests column array in reservations table to get guests name via guest_id in guests tabl

    static async getAvailableRooms() {
        const [rows, fields] = await pool.execute(
            "SELECT COUNT(*) AS available_rooms FROM rooms WHERE status = 'available'"
        );
        return rows[0].available_rooms;
    }

    static async getUpcomingCheckins() {
        const [rows, fields] = await pool.execute(
            "SELECT * FROM reservations WHERE DATE(check_in_date) = CURDATE() AND status = 'upcoming'"
        );
        return rows;
    }


}



module.exports = Dashboard;