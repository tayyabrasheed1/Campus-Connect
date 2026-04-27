const mongoose = require("mongoose");
const env = require("./env");

let cachedConnection = null;
let connectionPromise = null;

const connectDB = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(env.mongoUri, {
        bufferCommands: false,
      })
      .then((connection) => {
        console.log("MongoDB connected");
        return connection;
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  cachedConnection = await connectionPromise;
  return cachedConnection;
};

module.exports = connectDB;
