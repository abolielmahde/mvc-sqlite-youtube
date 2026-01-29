const { get, run } = require("../db/sqlite");

class UserRepository {
  async findByEmail(email) {
    return get("SELECT * FROM users WHERE email = ?", [email.trim().toLowerCase()]);
  }

  async findById(id) {
    return get("SELECT * FROM users WHERE id = ?", [id]);
  }

  async create({ email, fullName, passwordHash }) {
    const now = new Date().toISOString();
    const result = await run(
      "INSERT INTO users (email, fullName, passwordHash, createdAt) VALUES (?, ?, ?, ?)",
      [email.trim().toLowerCase(), fullName.trim(), passwordHash, now]
    );
    return this.findById(result.lastID);
  }
}

module.exports = { UserRepository };
