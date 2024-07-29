const Joi = require("joi");

const validator = (schema) => (payload) => {
	return schema.validate(payload, { abortEarly: false });
};

const loginSchema = Joi.object({
	email: Joi.string()
		.email({ minDomainSegments: 4, tlds: { allow: ["th"] } })
		.required(),
	password: Joi.string().required(),
});

const registerSchema = Joi.object({
	username: Joi.string().alphanum().min(3).max(50).required(),
	email: Joi.string()
		.email({ minDomainSegments: 4, tlds: { allow: ["th"] } })
		.required(),
	// email: Joi.string()
	// 	.email({ minDomainSegments: 2, tlds: { allow: ["com"] } })
	// 	.required(),
	password: Joi.string().min(3).max(50).required(),
	re_password: Joi.ref("password"),
});

const setNewPasswordSchema = Joi.object({
	password: Joi.string().min(3).max(50).required(),
	re_password: Joi.ref("password"),
});

const changePasswordSchema = Joi.object({
	old_password: Joi.string().required(),
	new_password: Joi.string().min(3).max(50).required(),
	re_password: Joi.ref("new_password"),
});

const editUserSchema = Joi.object({
	username: Joi.string().alphanum().min(3).max(50).required(),
	deleteProfilePic: Joi.string(),
	profile: Joi.string(),
});

module.exports = {
	validateLogin: validator(loginSchema),
	validateRegister: validator(registerSchema),
	validatesetNewPassword: validator(setNewPasswordSchema),
	validatechangePassword: validator(changePasswordSchema),
	validateeditUser: validator(editUserSchema),
};
