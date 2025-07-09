const User = require("../models/users.model");

const isUsernameTaken = async (username, userIdToExclude = null) => {
  const user = await User.findOne({ username });
  return user && user._id.toString() !== userIdToExclude?.toString();
};

const isEmailTaken = async (email, userIdToExclude = null) => {
  const user = await User.findOne({ email });
  return user && user._id.toString() !== userIdToExclude?.toString();
};

module.exports = {
  isUsernameTaken,
  isEmailTaken,
};
