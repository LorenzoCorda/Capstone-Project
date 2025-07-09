const Participation = require("../models/participation.model");
const TrainingPost = require("../models/trainingPost.model");

// Crea una partecipazione
const createParticipationService = async (userId, postId) => {
  // Controlla se il post esiste
  const post = await TrainingPost.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  // Conta quante partecipazioni ci sono già
  const count = await Participation.countDocuments({ postId });

  // Controlla se si è raggiunto il limite massimo
  if (post.maxParticipants && count >= post.maxParticipants) {
    throw new Error("Maximum number of participants reached");
  }

  // Crea la partecipazione
  const participation = new Participation({ userId, postId });

  return await participation.save();
};

//cancellazione partecipazione
const cancelParticipationService = async (userId, postId) => {
  const deleted = await Participation.findOneAndDelete({ userId, postId });

  if (!deleted) {
    throw new Error("Participation not found or already cancelled");
  }

  return {
    success: true,
    message: "Participation cancelled successfully",
  };
};

// Visualizza partecipazioni dell'utente autenticato
const getParticipantsByPostIdService = async (postId) => {
  const participations = await Participation.find({ postId })
    .populate("userId", "name username profileImage styles location") // solo alcuni campi
    .sort({ joinedAt: 1 }); // opzionale: ordina per data di iscrizione

  return participations;
};

// Visualizza partecipazioni dell'utente autenticato
const getUserParticipationsService = async (userId) => {
  const participations = await Participation.find({ userId })
    .populate("postId") // popola i dati del post
    .sort({ joinedAt: -1 });

  return participations.map((p) => p.postId);
};

module.exports = {
  createParticipationService,
  cancelParticipationService,
  getParticipantsByPostIdService,
  getUserParticipationsService,
};
