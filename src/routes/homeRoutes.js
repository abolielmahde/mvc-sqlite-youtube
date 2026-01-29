const express = require("express");
const { HomeController } = require("../controllers/HomeController");
const { requireAuth } = require("../middleware/requireAuth");

const router = express.Router();
const ctrl = new HomeController();

router.get("/", requireAuth, (req, res) => ctrl.home(req, res));

module.exports = router;
