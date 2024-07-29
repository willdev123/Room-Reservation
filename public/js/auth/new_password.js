const param = window.location.pathname;
const token = param.substring(param.lastIndexOf("/") + 1, param.length);

const redirect = async () => {
	const res = await fetch("/redirect_password_verification", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			authorization: `${token}`,
		},
	});
	const data = await res.json();
	if (data.message == "Invalid token") {
		window.location.replace("/invalid_token");
	}
};
redirect();

document.querySelector("#confirm-btn").onclick = async () => {
	const password = document.querySelector("#password").value;
	const re_password = document.querySelector("#re-password").value;
	const err_password = document.querySelector("#error-password");
	const err_repassword = document.querySelector("#error-repassword");

	err_password.innerHTML = "";
	err_repassword.innerHTML = "";

	const res = await fetch("/api/new_password", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			password,
			re_password,
		}),
	});

	const data = await res.json();
	console.log(data);
	if (data.message == "Password changed successfully!") {
		Swal.fire({
			icon: "success",
			title: data.message,
		}).then(() => {
			window.location.assign("/login");
		});
	} else {
		if (data.message[0].context.key == "password") {
			err_password.innerHTML = `<i class="bi bi-exclamation-circle me-1"></i>${data.message[0].message.replaceAll(
				'"',
				"",
			)}`;
		} else {
			err_repassword.innerHTML = `<i class="bi bi-exclamation-circle me-1"></i> confirm password must be matched with password`;
		}
	}
};
