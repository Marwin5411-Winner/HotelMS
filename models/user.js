//Create user model
const pool = require("../config/db.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;

class User {
  constructor(user) {
    this.id = user.id;
    this.username = user.name;
    this.password = user.password;
    this.realname = user.email;
    this.role = user.role
  }

  //Create a new user
  static async create(user) {
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    const [rows, fields] = await pool.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [user.name, user.email, hashedPassword]
    );
    return rows;
  }

  //Find a user by username
  static async findByEmail(email) {
    const [rows, fields] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows[0];
  }

  //Find a user by id
  static async findById(id) {
    const [rows, fields] = await pool.execute(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  //Compare the password
  static async comparePassword(password, hash) {
    const match = await bcrypt.compare(password, hash);
    return match;
  }
}

module.exports = User;