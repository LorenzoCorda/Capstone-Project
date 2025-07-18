const {
  getAllTrainingPostService,
  getTrainingPostByIdService,
  getMyTrainingPostsService,
  createTrainingPostService,
  updateTrainingPostService,
  deleteTrainingPostService,
} = require("../services/trainingPost.service");
const { updatePostSchema } = require("../validators/trainingPostValidator");

// prenti tutti i post
const getAllTrainingPostController = async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 25,
      search = "",
      city = "",
      country = "",
      sort = "desc",
    } = req.query;

    const { totalPosts, totalPages, posts } = await getAllTrainingPostService(
      search,
      city,
      country,
      Number(page),
      Number(pageSize),
      sort
    );

    res.status(200).send({
      page: Number(page),
      totalPages,
      totalPosts,
      posts,
      statusCode: 200,
      message:
        posts.length === 0
          ? "Nessun post trovato"
          : "Posts trovati con successo",
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//i miei posts
const getMyTrainingPostsController = async (req, res) => {
  try {
    const posts = await getMyTrainingPostsService(req.user._id);
    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Errore nel recupero dei tuoi post",
      error: error.message,
    });
  }
};

//singolo post con ID
const getTrainingPostByIdController = async (req, res) => {
  try {
    const post = await getTrainingPostByIdService(req.params.id);
    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

//crei un post

const createTrainingPostController = async (req, res) => {
  try {
    const { title, description, address, date, maxParticipants } = req.body;

    const imageUrl = req.file?.path || null;

    const updateData = {
      title,
      description,
      date,
      maxParticipants,
      location: {
        address: address || "",
      },
    };

    const post = await createTrainingPostService(
      updateData,
      req.user._id,
      imageUrl
    );

    res.status(201).json({
      success: true,
      message: "Post creato con successo",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Errore interno",
      error: error.message,
    });
  }
};

//modifichi un post

const updateTrainingPostController = async (req, res) => {
  try {
    const { id } = req.params;

    // qui Joi ha già validato req.body.address come stringa
    const updateData = {
      ...req.body,
      location: {
        address: req.body.address,
      },
    };

    if (req.file && req.file.path) {
      updateData.image = req.file.path;
    }

    const updatedPost = await updateTrainingPostService(id, updateData);

    res.status(200).json({
      success: true,
      message: "Post aggiornato con successo",
      data: updatedPost,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//elimini un post
const deleteTrainingPostController = async (req, res) => {
  try {
    const result = await deleteTrainingPostService(req.params.id, req.user._id);
    res.status(200).json(result);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

module.exports = {
  getAllTrainingPostController,
  getMyTrainingPostsController,
  getTrainingPostByIdController,
  createTrainingPostController,
  updateTrainingPostController,
  deleteTrainingPostController,
};
