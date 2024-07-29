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

	if (data.role === "staff") {
		window.location.assign("/manage_rooms");
	} else if (data.role === "student") {
		window.location.assign("/student_landing");
	} else if (data.role === "lecturer") {
		window.location.assign("/lec_browse_rooms");
	} else if (data.role === "Invalid user") {
		window.location.assign("/invalid_user");
	} else {
		console.log("No Token");
	}
};

redirect();

document.querySelector("#login-btn").onclick = () => {
	window.location.assign("/login");
};
