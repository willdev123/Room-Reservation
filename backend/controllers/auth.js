const db = require("../helpers/db");
const bcrypt = require("bcrypt");
const {
	validateLogin,
	validateRegister,
	validatesetNewPassword,
} = require("../helpers/validator");
const {
	register_mail_options,
	forget_password_mail_options,
	transporter,
} = require("../helpers/mail");
const { generateToken } = require("../helpers/auth");

require("dotenv").config();

const login = async (req, res) => {
	const q = "SELECT * FROM user WHERE email = ? ";

	try {
		const { error, value } = validateLogin(req.body);
		if (error) {
			return res.status(400).json({ message: error.details });
		}

		const user = await db.query(q, [value.email]);

		if (user[0].length == 0) {
			return res.status(400).json({
				message: "User not found!",
			});
		} else {
			bcrypt.compare(
				value.password,
				user[0][0].password,
				function (err, result) {
					if (err) {
						console.log(err);
						return res.status(500).json({ message: "Server Error!" });
					}

					if (!result) {
						return res.status(400).json({ message: "Wrong password!" });
					} else {
						const accessToken = generateToken(
							user[0][0],
							process.env.SCRETE_KEY,
							"30d",
						);

						return res.status(201).json({ role: user[0][0].role, accessToken });
					}
				},
			);
		}
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Server Error!" });
	}
};

const register = async (req, res) => {
	const q1 = "SELECT * FROM user WHERE email = ?";
	const q2 = "INSERT INTO user (username, email, password) VALUES (?, ?, ?)";

	try {
		const { error, value } = validateRegister(req.body);
		if (error) {
			return res.status(400).json({ message: error.details });
		}
		const user = await db.query(q1, [value.email]);
		if (user[0].length !== 0) {
			return res.status(400).json({ message: "User already exists!" });
		} else {
			bcrypt.hash(value.password, 10, async function (err, hash) {
				if (err) {
					console.log(err);
					return res.status(500).json({ message: "Server Error!" });
				} else {
					await db.query(q2, [value.username, value.email, hash]);
					const user = await db.query(q1, [value.email]);
					const accessToken = generateToken(
						user[0][0],
						process.env.REGISTER_SECRETE_KEY,
						"1m",
					);
					const url = `http://localhost:3000/email_verification/${accessToken}`;
					const options = register_mail_options(user[0][0].email, url);
					transporter.sendMail(options);
					return res.status(201).json({
						message:
							"Registered successfully. Check your mail to verfiy account!",
					});
				}
			});
		}
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Server Error!" });
	}
};

const verifyEmail = async (req, res) => {
	const q = "UPDATE user SET isVerified = 1 WHERE id = ?";
	console.log(req.user.id);
	try {
		await db.query(q, [req.user.id]);
		return res.status(200).json({ message: "Email verified successfully!" });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Server Error!" });
	}
};

const forgetPassword = async (req, res) => {
	const q = "SELECT * FROM user WHERE email = ?";
	const email = req.body.email;
	try {
		if (!email) {
			return res.status(400).json({ message: "Email must not be empty!" });
		}

		const user = await db.query(q, [email]);
		if (user[0].length == 0) {
			return res.status(400).json({ message: "Invalid email!" });
		} else {
			const accessToken = generateToken(
				user[0][0],
				process.env.PASSWORD_SECRETE_KEY,
				"1m",
			);
			const url = `http://localhost:3000/new_password/${accessToken}`;
			const options = forget_password_mail_options(user[0][0].email, url);
			transporter.sendMail(options);
			return res.status(201).json({ message: "Email sent successfully!" });
		}
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Server Error!" });
	}
};

const setNewPassword = async (req, res) => {
	const q = "UPDATE user SET password = ? WHERE id = ?";
	const { error, value } = validatesetNewPassword(req.body);
	try {
		if (error) {
			return res.status(400).json({ message: error.details });
		} else {
			bcrypt.hash(value.password, 10, async (err, hash) => {
				if (err) {
					console.log(err);
					return res.status(500).json({ message: "Server Error!" });
				} else {
					await db.query(q, [hash, req.user.id]);
					return res
						.status(200)
						.json({ message: "Password changed successfully!" });
				}
			});
		}
	} catch (error) {
		console.log(err);
		return res.status(500).json({ message: "Server Error!" });
	}
};

const sendVeriEmail = async (req, res) => {
	const id = req.user.id;

	const q = "SELECT * from user WHERE id = ?";
	try {
		const user = await db.query(q, [id]);
		const accessToken = generateToken(
			user[0][0],
			process.env.REGISTER_SECRETE_KEY,
			"1m",
		);
		const url = `http://localhost:3000/email_verification/${accessToken}`;
		const options = register_mail_options(user[0][0].email, url);
		transporter.sendMail(options);
		return res.status(201).json({
			message: "Email sent successfully. Check your mail to verfiy account!",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Server Error!" });
	}
};

module.exports = {
	login,
	register,
	verifyEmail,
	forgetPassword,
	setNewPassword,
	sendVeriEmail,
};
