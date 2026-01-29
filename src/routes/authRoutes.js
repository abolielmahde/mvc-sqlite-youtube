const express = require("express");
const { AuthController } = require("../controllers/AuthController");

const router = express.Router();
const ctrl = new AuthController();

router.get("/login", (req, res) => ctrl.showLogin(req, res));
router.post("/login", (req, res, next) => ctrl.login(req, res, next));

router.get("/register", (req, res) => ctrl.showRegister(req, res));
router.post("/register", (req, res, next) => ctrl.register(req, res, next));

// Logout via POST recommended; also accept GET for convenience
router.post("/logout", (req, res) => ctrl.logout(req, res));
router.get("/logout", (req, res) => ctrl.logout(req, res));

module.exports = router;
