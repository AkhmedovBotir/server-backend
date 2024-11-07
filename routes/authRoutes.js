const express = require("express");
const { registerUser, loginUser, updatePassword} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const getUserProfile = require('../controllers/profileController');

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);



router.get('/profile', authMiddleware, getUserProfile);



module.exports = router;


module.exports = router;

