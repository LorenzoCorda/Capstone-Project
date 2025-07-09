const mongoose = require("mongoose");
require("dotenv").config();

const initDatabaseConnection = async () => {
  try {
    //connection db
    await mongoose.connect(process.env.DB_URL);
    console.log("DB connected");
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1);
  }
};

const startServer = async (port, app) => {
  await initDatabaseConnection();
  app.listen(port, () => {
    console.log(`Server up on running on port ${port}`);
  });
};

module.exports = startServer;
