const express = require("express");
const { createLobby, joinLobby, leaveLobby } = require("../controllers/lobbyController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createLobby);
router.post("/:lobbyId/join", authMiddleware, joinLobby);
router.post("/:lobbyId/leave", authMiddleware, leaveLobby);

module.exports = router;
