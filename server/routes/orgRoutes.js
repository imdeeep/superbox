const express = require("express");
const router = express.Router();
const { createOrganisation, getOrganisation, deleteOrganisation } = require('../controllers/orgController');
const { authLimiter } = require('../middlewares/authMiddleware');

router.use(authLimiter);


router.post("/create", createOrganisation);
router.get("/:userId", getOrganisation);
router.delete("/delete/:OrgId", deleteOrganisation);

module.exports = router;