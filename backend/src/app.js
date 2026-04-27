const express = require("express");
const cors = require("cors");
const env = require("./config/env");

const authRoutes = require("./routes/authRoutes");
const assistantRoutes = require("./routes/assistantRoutes");
const reportRoutes = require("./routes/reportRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

const allowedOrigins = new Set([env.frontendUrl]);
if (process.env.VERCEL_URL) {
  allowedOrigins.add(`https://${process.env.VERCEL_URL}`);
}

if (env.nodeEnv !== "production") {
  allowedOrigins.add("http://localhost:5173");
  allowedOrigins.add("http://localhost:5174");
  allowedOrigins.add("http://127.0.0.1:5173");
  allowedOrigins.add("http://127.0.0.1:5174");
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());

const mountApiRoutes = (prefix) => {
  app.get(`${prefix}/health`, (req, res) => {
    res.json({ status: "ok", service: "Campus Connect API" });
  });

  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/faqs`, assistantRoutes);
  app.use(`${prefix}/assistant`, assistantRoutes);
  app.use(`${prefix}/reports`, reportRoutes);
  app.use(`${prefix}/admin`, adminRoutes);
  app.use(`${prefix}/users`, userRoutes);
  app.use(`${prefix}/events`, eventRoutes);
  app.use(`${prefix}/chats`, chatRoutes);
};

mountApiRoutes("/api");
mountApiRoutes("");

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
