const multer = require("multer");

const disk = (folder) => {
	return multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, "/Users/williamkhant/Desktop/Web Project/public/" + folder);
		},
		filename: function (req, file, cb) {
			const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
			cb(null, uniqueSuffix + file.originalname.replace(/\s+/g, "_"));
		},
	});
};

const upload = (folder) => multer({ storage: disk(folder) });

module.exports = {
	upload,
};
