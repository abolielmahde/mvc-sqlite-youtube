const { AuthService } = require("../services/AuthService");

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  showLogin(req, res) {
    if (req.session.user) return res.redirect("/");
    res.render("auth/login", { title: "Login" });
  }

  showRegister(req, res) {
    if (req.session.user) return res.redirect("/");
    res.render("auth/register", { title: "Register" });
  }

  async login(req, res, next) {
    try {
      const user = await this.authService.login(req.body);
      req.session.user = user;
      req.session.flash = { type: "success", message: `Welcome back, ${user.fullName}!` };
      res.redirect("/");
    } catch (err) {
      req.session.flash = { type: "danger", message: err.message };
      res.redirect("/auth/login");
    }
  }

  async register(req, res, next) {
    try {
      const user = await this.authService.register(req.body);
      req.session.user = user;
      req.session.flash = { type: "success", message: `Account created. Welcome, ${user.fullName}!` };
      res.redirect("/");
    } catch (err) {
      req.session.flash = { type: "danger", message: err.message };
      res.redirect("/auth/register");
    }
  }

  logout(req, res) {
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect("/auth/login");
    });
  }
}

module.exports = { AuthController };
