import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./DB/db.js";

import resumeRoutes from "./routes/resumeRoutes.js";
import userRoutes from "./routes/userRoute.js";
import aiRouter from "./routes/aiRoutes.js";

const app = express();

/* ===============================
   Database
================================= */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

console.log("Connecting to database...");
connectDB().catch(err => {
  console.error("Database connection error:", err);
  process.exit(1);
});

/* ===============================
   Middlewares
================================= */

// Allow requests from localhost and your deployed frontend
const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-resume-builder-zhpc.vercel.app"
];

app.use(
  cors({
    origin: function(origin, callback){
      // allow requests with no origin (like Postman)
      if(!origin) return callback(null, true);
      if(allowedOrigins.includes(origin)){
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

/* ===============================
   Routes
================================= */
// Test endpoints
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is connected!" });
});

app.post("/api/test-register", (req, res) => {
  console.log("Test register called with:", req.body);
  res.json({ message: "Test endpoint works", received: req.body });
});

// Main routes
console.log("Setting up routes...");
app.use("/api/users", userRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRouter);
console.log("Routes configured");

// Debug: list registered routes
app.get('/__routes', (req, res) => {
  try {
    const routes = app._router.stack
      .filter(r => r.route)
      .map(r => ({ path: r.route.path, methods: r.route.methods }));
    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===============================
   Server
================================= */
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => res.send("Server is live..."));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("🔴 Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});