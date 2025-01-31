const express = require("express");
const router = express.Router();
const { createNotes, getNotes, deleteNotes } = require('../controllers/notesController');
const { authLimiter } = require('../middlewares/authMiddleware');

router.use(authLimiter);

router.post("/create", createNotes);
router.get("/:userId", getNotes);
router.delete("/delete/:notesId", deleteNotes);

module.exports = router;