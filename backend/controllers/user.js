const db = require("../helpers/db");
const bcrypt = require("bcrypt");
const fs = require("fs");
const {
	validatechangePassword,
	validateeditUser,
} = require("../helpers/validator");
const getUser = async (req, res) => {
	const user_id = req.user.id;
	const q = "SELECT * FROM user WHERE id = ?";

	try {
		const result = await db.query(q, [user_id]);

		if (!result[0][0].profile_picture) {
			result[0][0].profile_picture = "/public/img/user.png";
		}

		const { password, ...user } = result[0][0];
		return res.status(200).json({
			user,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Server Error!",
		});
	}
};

const changePassword = async (req, res) => {
	const user_id = req.user.id;
	const { old_password, new_password, re_password } = req.body;
	const q1 = "SELECT password from user WHERE id = ?";
	const q2 = "UPDATE user SET password = ? WHERE id = ?";
	try {
		const { error, value } = validatechangePassword(req.body);

		const oldPassword = await db.query(q1, [user_id]);
		if (error) {
			return res.status(400).json({ message: error.details });
		}

		bcrypt.compare(
			old_password,
			oldPassword[0][0].password,
			function (err, result) {
				if (err) {
					console.log(err);
					return res.status(500).json({ message: "Server Error!" });
				}
				if (!result) {
					return res.status(400).json({ message: "Old password wrong!" });
				} else {
					bcrypt.hash(value.new_password, 10, async (err, hash) => {
						if (err) {
							console.log(err);
							return res.status(500).json({ message: "Server Error!" });
						} else {
							await db.query(q2, [hash, user_id]);

							return res
								.status(201)
								.json({ message: "Password changed successfully!" });
						}
					});
				}
			},
		);
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Server Error!",
		});
	}
};

const editUser = async (req, res) => {
	const user_id = req.user.id;
	const { deleteProfilePic } = req.body;
	const profile = req.file;

	console.log(req.body);

	const q1 = "SELECT profile_picture from user WHERE id = ?";
	const q2 = "UPDATE user SET profile_picture = ? WHERE id = ?";
	let q3 = "UPDATE user SET username = ?";

	try {
		const { error, value } = validateeditUser(req.body);
		if (error) {
			if (profile) {
				fs.unlinkSync(profile.path);
			}
			return res.status(400).json({ message: error.details });
		}

		if (deleteProfilePic == "true") {
			const image = await db.query(q1, [user_id]);
			if (image[0][0].profile_picture) {
				fs.unlinkSync(
					"/Users/williamkhant/Desktop/Web Project/" +
						image[0][0].profile_picture,
				);
			}

			const image_update = null;
			await db.query(q2, [image_update, user_id]);
		}

		if (profile) {
			const image = await db.query(q1, [user_id]);
			if (image[0][0].profile_picture) {
				fs.unlinkSync(
					"/Users/williamkhant/Desktop/Web Project/" +
						image[0][0].profile_picture,
				);
			}

			q3 += ", profile_picture = ? WHERE id = ?";
			await db.query(q3, [
				value.username,
				profile.path.slice(profile.path.indexOf("/public")),
				user_id,
			]);
		} else {
			q3 += " WHERE id = ?";
			await db.query(q3, [value.username, user_id]);
		}

		return res.status(201).json({
			message: "Profile updated successfully!",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Server Error!",
		});
	}
};

module.exports = { getUser, changePassword, editUser };
