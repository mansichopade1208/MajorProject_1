
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes);
// Homepage test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MediKiosk backend is running!",
  });
});

// API health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "MediKiosk API is working",
  });
});

// Start server only after MongoDB connects
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(
      `MediKiosk backend running at http://localhost:${PORT}`
    );
  });
};

startServer();
