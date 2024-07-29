const nodemailer = require("nodemailer");
require("dotenv").config();

const register_mail_options = (user_mail, url) => {
	return {
		from: {
			name: "MFU room reservation",
			address: process.env.MAIL,
		}, // sender address
		to: user_mail, // list of receivers
		subject: "Account Verification", // Subject line
		text: "Verfiy your email", // plain text body
		html: `Please click this link to confirm your email<br><a href="${url}">${url}</a>`, // html body
	};
};

const forget_password_mail_options = (user_mail, url) => {
	return {
		from: {
			name: "MFU room reservation",
			address: process.env.MAIL,
		}, // sender address
		to: user_mail, // list of receivers
		subject: "Password Recovery", // Subject line
		html: `Please click this link to set your new password<br><a href="${url}">${url}</a>`, // html body
	};
};

const transporter = nodemailer.createTransport({
	service: "gmail",
	host: "smtp.gmail.email",
	port: 587,
	secure: false, // Use `true` for port 465, `false` for all other ports
	auth: {
		user: process.env.MAIL,
		pass: process.env.MAIL_PASSWORD,
	},
});

module.exports = {
	register_mail_options,
	forget_password_mail_options,
	transporter,
};
