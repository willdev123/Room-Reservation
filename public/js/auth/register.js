const err_username = document.querySelector("#error-username");
const err_email = document.querySelector("#error-email");
const err_password = document.querySelector("#error-password");
const err_repassword = document.querySelector("#error-repassword");
const err = document.querySelector("#error");

function togglePasswordVisibility() {
	var passwordField = document.getElementById("password");
	var icon = document.querySelector(".toggle-icon");

	if (passwordField.type === "password") {
		passwordField.type = "text";
		icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
      <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
    </svg>`; // Change to an eye-slash icon
	} else {
		passwordField.type = "password";
		icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye toggle-icon" viewBox="0 0 16 16">
      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
    </svg>`; // Change to an eye icon
	}
}
function toggleRePasswordVisibility() {
	var passwordField = document.getElementById("re-password");
	var icon = document.querySelector(".re-toggle-icon");

	if (passwordField.type === "password") {
		passwordField.type = "text";
		icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
      <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
    </svg>`; // Change to an eye-slash icon
	} else {
		passwordField.type = "password";
		icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye toggle-icon" viewBox="0 0 16 16">
      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
    </svg>`; // Change to an eye icon
	}
}

document.querySelector("#register-btn").onclick = async () => {
	const username = document.querySelector("#username").value;
	const email = document.querySelector("#email").value;
	const password = document.querySelector("#password").value;
	const re_password = document.querySelector("#re-password").value;

	err_username.innerHTML = "";
	err_email.innerHTML = "";
	err_password.innerHTML = "";
	err_repassword.innerHTML = "";
	err.innerHTML = "";

	const res = await fetch("/api/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			username,
			email,
			password,
			re_password,
		}),
	});
	const message = await res.json();

	if (
		message.message ==
		"Registered successfully. Check your mail to verfiy account!"
	) {
		Swal.fire({
			icon: "success",
			title: message.message,
		});
	} else if (
		message.message == "User already exists!" ||
		message.message == "Server Error!"
	) {
		err.innerHTML = `<i class="bi bi-exclamation-circle me-1"></i>${message.message}`;
	} else {
		message.message.forEach((m) => {
			if (m.context.key == "username") {
				if (m.type == "string.alphanum") {
					err_username.innerHTML = `<i class="bi bi-exclamation-circle me-1"></i> special characters are not allowed in username`;
				} else {
					err_username.innerHTML = `<i class="bi bi-exclamation-circle me-1"></i>${m.message.replaceAll(
						'"',
						"",
					)}`;
				}
			} else if (m.context.key == "email") {
				if (m.type == "string.email") {
					err_email.innerHTML = `<i class="bi bi-exclamation-circle me-1"></i> email is invalid`;
				} else {
					err_email.innerHTML = `<i class="bi bi-exclamation-circle me-1"></i>${m.message.replaceAll(
						'"',
						"",
					)}`;
				}
			} else if (m.context.key == "password") {
				err_password.innerHTML = `<i class="bi bi-exclamation-circle me-1"></i>${m.message.replaceAll(
					'"',
					"",
				)}`;
			} else {
				err_repassword.innerHTML = `<i class="bi bi-exclamation-circle me-1"></i> Confirm password must be matched with the password`;
			}
		});
	}
};
