const TrainingPost = require("../models/trainingPost.model");

// prenti tutti i post
const getAllTrainingPostService = async (
  search = "",
  city = "",
  country = "",
  page = 1,
  pageSize = 10,
  sort = "desc"
) => {
  const query = {};

  const searchConditions = [];

  if (search) {
    const regex = new RegExp(search, "i");
    searchConditions.push(
      { title: { $regex: regex } },
      { "location.city": { $regex: regex } }
    );
  }

  if (city) {
    query["location.city"] = { $regex: new RegExp(city, "i") };
  }

  if (country) {
    query["location.country"] = { $regex: new RegExp(country, "i") };
  }

  if (searchConditions.length > 0) {
    query.$or = searchConditions;
  }

  const sortOrder = sort === "asc" ? 1 : -1;

  const posts = await TrainingPost.find(query)
    .limit(pageSize)
    .skip((page - 1) * pageSize)
    .sort({ createdAt: sortOrder });

  const totalPosts = await TrainingPost.countDocuments(query);
  const totalPages = Math.ceil(totalPosts / pageSize);

  return {
    page,
    pageSize,
    totalPosts,
    totalPages,
    posts,
  };
};

//singolo post con ID
const getTrainingPostByIdService = async (postId) => {
  const post = await TrainingPost.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }
  return post;
};

const getMyTrainingPostsService = async (userId) => {
  const posts = await TrainingPost.find({ author: userId }).sort({
    createdAt: -1,
  });
  return posts;
};

//crei un post
const createTrainingPostService = async (body, userId) => {
  const newPost = new TrainingPost({
    ...body,
    author: userId,
  });

  return await newPost.save();
};

//modifica del post
const updateTrainingPostService = async (id, postPayload) => {
  const options = { new: true };
  const updatedPost = await TrainingPost.findByIdAndUpdate(
    id,
    postPayload,
    options
  );
  if (!updatedPost) {
    throw new Error("Post not found or not updated");
  }
  return updatedPost;
};

//elimini un post
const deleteTrainingPostService = async (postId, userId) => {
  const post = await TrainingPost.findById(postId);

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.author.toString() !== userId.toString()) {
    throw new Error("You don't have permissions to delete this post");
  }

  await post.deleteOne();

  return {
    success: true,
    message: "Post deleted successfully",
  };
};

module.exports = {
  getAllTrainingPostService,
  getTrainingPostByIdService,
  getMyTrainingPostsService,
  createTrainingPostService,
  updateTrainingPostService,
  deleteTrainingPostService,
};
