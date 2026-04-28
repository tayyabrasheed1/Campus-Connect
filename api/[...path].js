const app = require("../backend/src/app");
const connectDB = require("../backend/src/config/db");

let dbConnected = false;

module.exports = async (req, res) => {
	try {
		if (!dbConnected) {
			await connectDB();
			dbConnected = true;
		}
		return app(req, res);
	} catch (error) {
		console.error("Database connection failed", error.message);
		res.status(500).json({ message: "Database connection failed" });
	}
};