const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
// In production, restrict to your Vercel frontend URL
const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL, "http://localhost:3000", "http://localhost:5173"]
  : ["*"];

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? (origin, cb) => {
            if (!origin || allowedOrigins.includes(origin)) cb(null, true);
            else cb(new Error("Not allowed by CORS"));
          }
        : "*",
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));

// ── Cache headers for public GET routes ───────────────────────────────────────
// Reduces API calls — browser caches for 5 min, CDN for 10 min
// Admin writes (PUT/POST/DELETE) bypass cache automatically
app.use((req, res, next) => {
  if (
    req.method === "GET" &&
    !req.path.includes("/auth") &&
    !req.path.includes("/messages")
  ) {
    res.set("Cache-Control", "public, max-age=300, s-maxage=600");
  } else {
    res.set("Cache-Control", "no-store");
  }
  next();
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/skills", require("./routes/skills"));
app.use("/api/experience", require("./routes/experience"));
app.use("/api/education", require("./routes/education"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/upload", require("./routes/upload"));

// ── Keep-alive ping endpoint ──────────────────────────────────────────────────
// cron-job.org pings this every 14 min to prevent Render free tier cold starts
app.get("/ping", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    uptime: Math.floor(process.uptime()) + "s",
  });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server error" });
});

// ── Connect MongoDB & seed ────────────────────────────────────────────────────
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/gopal_portfolio",
  )
  .then(async () => {
    console.log("✅ MongoDB connected");

    // Self-ping to keep Render free tier alive (every 14 min)
    // Set SELF_URL in Render environment variables to your backend URL
    if (process.env.SELF_URL && process.env.NODE_ENV === "production") {
      const https = require("https");
      const http = require("http");
      const pingUrl = `${process.env.SELF_URL}/ping`;
      const requester = pingUrl.startsWith("https") ? https : http;

      setInterval(
        () => {
          requester
            .get(pingUrl, (res) => {
              console.log(`🏓 Self-ping: ${res.statusCode}`);
            })
            .on("error", (e) => {
              console.error("Self-ping failed:", e.message);
            });
        },
        14 * 60 * 1000,
      ); // every 14 minutes

      console.log(`🏓 Self-ping active → ${pingUrl}`);
    }
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
