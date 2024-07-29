const jwt = require("jsonwebtoken");
require("dotenv").config;

const generateToken = (user, key, expiry) => {
	return jwt.sign({ id: user.id, role: user.role }, key, { expiresIn: expiry });
};
const verifyUserToken = (req, res, next) => {
	const accessToken = req.headers.authorization;

	if (accessToken) {
		const token = accessToken.split(" ")[1];

		jwt.verify(token, process.env.SCRETE_KEY, (err, user) => {
			if (err) {
				return res.status(403).json({ message: "Token is invalid" });
			}
			req.user = user;
			next();
		});
	} else {
		return res.status(401).json({ message: "Unauthorized Acesss" });
	}
};

const verifyEmailToken = (req, res, next) => {
	const accessToken = req.headers.authorization;

	if (accessToken) {
		const token = accessToken.split(" ")[1];
		jwt.verify(token, process.env.REGISTER_SECRETE_KEY, (err, user) => {
			if (err) {
				return res.status(403).json({ message: "Token is invalid" });
			}
			req.user = user;
			next();
		});
	} else {
		return res.status(401).json({ message: "Unauthorized Acesss" });
	}
};

const verfiyForgetPasswordToken = (req, res, next) => {
	const accessToken = req.headers.authorization;

	if (accessToken) {
		const token = accessToken.split(" ")[1];
		jwt.verify(token, process.env.PASSWORD_SECRETE_KEY, (err, user) => {
			if (err) {
				return res.status(403).json({ message: "Token is invalid" });
			}
			req.user = user;
			next();
		});
	} else {
		return res.status(401).json({ message: "Unauthorized Acesss" });
	}
};
module.exports = {
	generateToken,
	verifyUserToken,
	verifyEmailToken,
	verfiyForgetPasswordToken,
};
