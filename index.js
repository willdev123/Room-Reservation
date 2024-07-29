//import library
const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const cron = require("node-cron");
const db = require("./backend/helpers/db");

//route files
const authRoutes = require("./backend/routes/auth");
const roomsRoutes = require("./backend/routes/rooms");
const bookingRoutes = require("./backend/routes/booking");
const commonRoutes = require("./backend/routes/commonRoutes");

//global variables
const PATH = "/Users/williamkhant/Desktop/Web Project";

//initiate app
const app = express();

//config env
require("dotenv").config();

//middlewares
app.use("/public", express.static(path.join(__dirname, "public/")));
app.use(express.json());

//routes
app.use("/", authRoutes);
app.use("/", roomsRoutes);
app.use("/", bookingRoutes);
app.use("/", commonRoutes);

app.get("/redirect", (req, res) => {
	const accessToken = req.headers.authorization;

	if (accessToken !== "null") {
		jwt.verify(accessToken, process.env.SCRETE_KEY, (err, user) => {
			if (err) {
				return res.status(403).json({ role: "Invalid user" });
			}

			return res.status(200).json({ role: user.role });
		});
	} else {
		return res.status(200).json({ role: "No Token" });
	}
});

app.get("/redirect_verification", (req, res) => {
	const accessToken = req.headers.authorization;

	jwt.verify(accessToken, process.env.REGISTER_SECRETE_KEY, (err, user) => {
		if (err) {
			return res.status(403).json({ message: "Invalid token" });
		}
		console.log(user);
		return res.status(200).json({ message: "Valid token" });
	});
});

app.get("/redirect_password_verification", (req, res) => {
	const accessToken = req.headers.authorization;

	jwt.verify(accessToken, process.env.PASSWORD_SECRETE_KEY, (err, user) => {
		if (err) {
			return res.status(403).json({ message: "Invalid token" });
		}
		return res.status(200).json({ message: "Valid token" });
	});
});

cron.schedule("00 00 00 * * *", async () => {
	const q =
		"UPDATE room SET timeslot1_status = 'free', timeslot2_status = 'free', timeslot3_status = 'free', timeslot4_status = 'free'";
	try {
		await db.query(q);
		console.log("All Time slots have been reset to free");
	} catch (err) {
		console.log(err);
	}
});

cron.schedule("0 0 8 * * *", async () => {
	const q =
		"UPDATE booking SET status = 'canceled' WHERE status ='pending' and time_slot = 1";
	try {
		await db.query(q);
		console.log("All pending bookings for 8-10 timeslot have been canceled");
	} catch (err) {
		console.log(err);
	}
});
cron.schedule("0 0 10 * * *", async () => {
	const q =
		"UPDATE booking SET status = 'canceled' WHERE status ='pending'and time_slot = 2";
	try {
		await db.query(q);
		console.log("All pending bookings for 10-12 timeslot have been canceled");
	} catch (err) {
		console.log(err);
	}
});
cron.schedule("0 0 12 * * *", async () => {
	const q =
		"UPDATE booking SET status = 'canceled' WHERE status ='pending' and time_slot = 3";
	try {
		await db.query(q);
		console.log("All pending bookings for 12-14 timeslot have been canceled");
	} catch (err) {
		console.log(err);
	}
});
cron.schedule("0 0 14 * * *", async () => {
	const q =
		"UPDATE booking SET status = 'canceled' WHERE status ='pending' and time_slot = 4";
	try {
		await db.query(q);
		console.log("All pending bookings for 14-16 timeslot have been canceled");
	} catch (err) {
		console.log(err);
	}
});

app.listen(process.env.PORT, () => {
	console.log("Server is up!");
});
