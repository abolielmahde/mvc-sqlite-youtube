const express = require("express");
const { VideoController } = require("../controllers/VideoController");
const { requireAuth } = require("../middleware/requireAuth");

const router = express.Router();
const ctrl = new VideoController();

router.get("/", requireAuth, (req, res) => ctrl.page(req, res));
router.post("/save", requireAuth, (req, res) => ctrl.save(req, res));
router.post("/:id/delete", requireAuth, (req, res) => ctrl.remove(req, res));

module.exports = router;
