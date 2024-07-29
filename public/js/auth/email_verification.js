const mailBtn = document.querySelector("#mail-btn");

const redirect = async () => {
	const param = window.location.pathname;
	const token = param.substring(param.lastIndexOf("/") + 1, param.length);

	const res = await fetch("/redirect_verification", {
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

mailBtn.onclick = async () => {
	let icon = "";
	let redirect = "";
	const param = window.location.pathname;
	const token = param.substring(param.lastIndexOf("/") + 1, param.length);
	const res = await fetch("/api/verify_email", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${token}`,
		},
	});

	const data = await res.json();
	if (data.message == "Email verified successfully!") {
		Swal.fire({
			icon: "success",
			title: data.message,
		}).then(() => {
			window.location.replace("/login");
		});
	} else {
		Swal.fire({
			icon: "warning",
			title: "Token expires but you can login and verify later",
		}).then(() => {
			window.location.replace("/login");
		});
	}
};
