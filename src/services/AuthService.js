const bcrypt = require("bcryptjs");
const { UserRepository } = require("../repositories/UserRepository");

class AuthService {
  constructor() {
    this.userRepo = new UserRepository();
  }

  async register(dto) {
    const email = (dto.email || "").trim().toLowerCase();
    const fullName = (dto.fullName || "").trim();
    const password = dto.password || "";

    if (!email || !fullName || !password) {
      const err = new Error("All fields are required.");
      err.status = 400;
      throw err;
    }

    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      const err = new Error("Email already registered.");
      err.status = 400;
      throw err;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.userRepo.create({ email, fullName, passwordHash });
    return this._sanitize(user);
  }

  async login(dto) {
    const email = (dto.email || "").trim().toLowerCase();
    const password = dto.password || "";

    if (!email || !password) {
      const err = new Error("Email and password are required.");
      err.status = 400;
      throw err;
    }

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      const err = new Error("Invalid email or password.");
      err.status = 401;
      throw err;
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      const err = new Error("Invalid email or password.");
      err.status = 401;
      throw err;
    }

    return this._sanitize(user);
  }

  _sanitize(userRow) {
    return {
      id: userRow.id,
      email: userRow.email,
      fullName: userRow.fullName,
      createdAt: userRow.createdAt,
    };
  }
}

module.exports = { AuthService };
