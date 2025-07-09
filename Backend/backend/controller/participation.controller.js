const {
  createParticipationService,
  cancelParticipationService,
  getParticipantsByPostIdService,
  getUserParticipationsService,
} = require("../services/participation.service");

// Crea una partecipazione
const createParticipationController = async (req, res) => {
  try {
    const userId = req.user._id; // dal token
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required",
      });
    }

    const participation = await createParticipationService(userId, postId);

    res.status(201).json({
      success: true,
      message: "Participation created successfully",
      data: participation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//cancellazione partecipazione
const cancelParticipationController = async (req, res) => {
  try {
    const userId = req.user._id; // preso dal token
    const postId = req.params.postId;

    const result = await cancelParticipationService(userId, postId);

    res.status(200).json(result);
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

// Visualizza partecipazioni a piu posts
const getUserParticipationsController = async (req, res) => {
  try {
    const userId = req.user._id;
    const posts = await getUserParticipationsService(userId);

    res.status(200).json({
      success: true,
      message: "User participations retrieved",
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
