const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authenticateToken");
const {
  createParticipationController,
  cancelParticipationController,
  getParticipantsByPostIdController,
  getUserParticipationsController,
} = require("../controller/participation.controller");

// Crea una partecipazione
router.post("/", authenticateToken, createParticipationController);
//cancella partecipazione
router.delete("/:postId", authenticateToken, cancelParticipationController);
// Visualizza partecipazioni dell'utente autenticato
router.get("/me", authenticateToken, getUserParticipationsController);
// Visualizza partecipanti a un post specifico
router.get("/:postId", authenticateToken, getParticipantsByPostIdController);

module.exports = router;
