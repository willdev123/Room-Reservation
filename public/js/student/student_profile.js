const profile_page_token = localStorage.getItem("accessToken");

const redirect = async () => {
	const accessToken = localStorage.getItem("accessToken");
	const res = await fetch("/redirect", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			authorization: `${accessToken}`,
		},
	});
	const data = await res.json();
	if (data.role === "student") {
		console.log("Valid user");
	} else if (data.role === "No Token") {
		window.location.assign("/");
	} else {
		window.location.replace("/invalid_user");
	}
};
redirect();

const changePasswordModal = new bootstrap.Modal(
	document.getElementById("change_password_modal"),
);

const file_input = document.querySelector("#file-input");
const profileImage = document.querySelector("#profile-image");
const removeBtn = document.querySelector("#remove-btn");
const saveBtn = document.querySelector("#save-btn");
const forgetLink = document.querySelector("#forget");
const verifyEmail = document.querySelector("#verify-email");
const err_username = document.querySelector("#error-username");
const modalConfirmBtn = document.querySelector("#modal-confirm-btn");
const err_old_password = document.querySelector("#error-old-password");
const err_new_password = document.querySelector("#error-new-password");
const err_re_password = document.querySelector("#error-re-password");
let deleteProfilePic = false;

file_input.onchange = () => {
	const src = URL.createObjectURL(file_input.files[0]);

	profileImage.src = src;
};

removeBtn.onclick = () => {
	deleteProfilePic = true;
	profileImage.src = "../../public/img/user.png";
};

//backend

const getProfileUser = async () => {
	const res = await fetch("/api/user", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${profile_page_token}`,
		},
	});

	const data = await res.json();

	document.querySelector("#profile-image").src = data.user.profile_picture;
	document.querySelector("#profile-username").value = data.user.username;
	document.querySelector("#profile-email").value = data.user.email;
	profileImage.src = data.user.profile_picture;

	if (data.user.isVerified == 0) {
		verifyEmail.classList.remove("d-none");
	}
};
getProfileUser();

saveBtn.onclick = async () => {
	const username = document.querySelector("#profile-username").value;
	let data = new FormData();
	data.append("username", username);
	data.append("deleteProfilePic", deleteProfilePic);
	data.append("profile", file_input.files[0]);

	const res = await fetch("/api/user", {
		method: "PUT",
		body: data,
		headers: {
			authorization: `Bearer ${profile_page_token}`,
		},
	});

	const message = await res.json();
	console.log(message);
	if (message.message == "Profile updated successfully!") {
		Swal.fire({
			icon: "success",
			title: message.message,
		}).then(() => {
			window.location.reload();
		});
	} else if (message.message == "Server Error!") {
		Swal.fire({
			icon: "warning",
			title: message.message,
		});
	} else {
		err_username.innerHTML = `<i class="bi bi-exclamation-circle me-1"></i>${message.message[0].message.replaceAll(
			'"',
			"",
		)}`;
	}
};

modalConfirmBtn.onclick = async () => {
	err_old_password.innerHTML = "";
	err_new_password.innerHTML = "";
	err_re_password.innerHTML = "";

	const old_password = document.querySelector("#old-password").value;
	const new_password = document.querySelector("#new-password").value;
	const re_password = document.querySelector("#re-password").value;
	const res = await fetch("/api/password", {
		method: "PUT",
		body: JSON.stringify({
			old_password,
			new_password,
			re_password,
		}),
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${profile_page_token}`,
		},
	});

	const message = await res.json();

	if (message.message === "Password changed successfully!") {
		Swal.fire({
			icon: "success",
			title: message.message,
		}).then(() => {
			changePasswordModal.hide();
		});
	} else if (message.message == "Old password wrong!") {
		err_old_password.innerHTML = `<i class="bi bi-exclamation-circle me-1"></i>${message.message}`;
	} else {
		message.message.forEach((m) => {
			if (m.context.key == "old_password") {
				err_old_password.innerHTML = `<i class="bi bi-exclamation-circle me-1"></i>${m.message
					.replaceAll('"', "")
					.replace("old_password", "Old password")}`;
			} else if (m.context.key == "new_password") {
				err_new_password.innerHTML = `<i class="bi bi-exclamation-circle me-1"></i>${m.message
					.replaceAll('"', "")
					.replace("new_password", "New password")}`;
			} else {
				err_re_password.innerHTML = `<i class="bi bi-exclamation-circle me-1"></i> Confirm password must be matched with the password`;
			}
		});
	}
};

forgetLink.onclick = () => {
	window.location.assign("/forget_password");
};

verifyEmail.onclick = async () => {
	const res = await fetch("/api/profile/verify_email", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${profile_page_token}`,
		},
	});

	const message = await res.json();

	if (
		message.message ==
		"Email sent successfully. Check your mail to verfiy account!"
	) {
		Swal.fire({
			icon: "success",
			title: message.message,
		});
	} else {
		Swal.fire({
			icon: "warning",
			title: message.message,
		});
	}
};

document.querySelector("#nav-profile").onclick = () => {
	document.querySelector(".profile-popup").classList.toggle("open");
};
