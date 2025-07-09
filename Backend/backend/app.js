const express = require("express");
const startServer = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
const trainingPostRoutes = require("./routes/trainingPost.routes");
const userRoutes = require("./routes/users.routes");
const authRoutes = require("./routes/auth.routes");
const participationRoutes = require("./routes/participation.routes");
const cors = require("cors");
require("dotenv").config();
//PORT
const PORT = 9099;

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://capstone-project-bice-nu.vercel.app",
    ], // solo il tuo frontend
    credentials: true, // se usi cookie o header con autenticazione
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

app.use(express.json());
//routes
app.use("/posts", trainingPostRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/participations", participationRoutes);

//middleware
app.use(errorHandler);
//connection db
startServer(PORT, app);
