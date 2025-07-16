const {
  createParticipationService,
  cancelParticipationService,
  getParticipantsByPostIdService,
  getUserParticipationsService,
} = require("../services/participation.service");

// Crea una partecipazione
const createParticipationController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "L'Id del post e richiesto",
      });
    }

    const participation = await createParticipationService(userId, postId);

    res.status(201).json({
      success: true,
      message: "Partecipazione creata con successo",
      data: {
        _id: participation.postId,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Cancellazione partecipazione
const cancelParticipationController = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.postId;

    await cancelParticipationService(userId, postId);

    res.status(200).json({
      success: true,
      message: "Partecipazione annullata con successo",
      data: {
        _id: postId,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Visualizza partecipanti a un post
const getParticipantsByPostIdController = async (req, res) => {
  try {
    const { postId } = req.params;

    const participants = await getParticipantsByPostIdService(postId);

    res.status(200).json({
      success: true,
      participants,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Visualizza partecipazioni a più posts
const getUserParticipationsController = async (req, res) => {
  try {
    const userId = req.user._id;
    const posts = await getUserParticipationsService(userId);

    res.status(200).json({
      success: true,
      message: "Partecipazioni dell'utente recuperate",
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  createParticipationController,
  cancelParticipationController,
  getParticipantsByPostIdController,
  getUserParticipationsController,
};
