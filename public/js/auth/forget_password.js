const error = document.querySelector("#error");

document.querySelector("#mail-btn").onclick = async () => {
	const email = document.querySelector("#email").value;
	error.innerHTML = "";
	const res = await fetch("/api/forget_password", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
		}),
	});

	const data = await res.json();

	if (data.message == "Email sent successfully!") {
		Swal.fire({
			icon: "success",
			title: data.message,
		}).then(() => {});
	} else {
		error.innerHTML = `<i class="bi bi-exclamation-circle me-1"></i> ${data.message}`;
	}
};
