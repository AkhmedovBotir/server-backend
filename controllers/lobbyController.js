const Lobby = require("../models/Lobby");

exports.createLobby = async (req, res) => {
  const { name } = req.body;
  try {
    const lobby = new Lobby({ name, users: [req.user.id] });
    await lobby.save();
    res.status(201).json(lobby);
  } catch (error) {
    res.status(500).json({ message: "Lobby creation failed", error });
  }
};

exports.joinLobby = async (req, res) => {
  const { lobbyId } = req.params;
  try {
    const lobby = await Lobby.findById(lobbyId);
    if (!lobby) return res.status(404).json({ message: "Lobby not found" });

    if (!lobby.users.includes(req.user.id)) {
      lobby.users.push(req.user.id);
      await lobby.save();
    }
    res.json(lobby);
  } catch (error) {
    res.status(500).json({ message: "Could not join lobby", error });
  }
};

exports.leaveLobby = async (req, res) => {
  const { lobbyId } = req.params;
  try {
    const lobby = await Lobby.findById(lobbyId);
    if (!lobby) return res.status(404).json({ message: "Lobby not found" });

    lobby.users = lobby.users.filter(user => user.toString() !== req.user.id);
    await lobby.save();
    res.json({ message: "Left the lobby", lobby });
  } catch (error) {
    res.status(500).json({ message: "Could not leave lobby", error });
  }
};
