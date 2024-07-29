const profile_token = localStorage.getItem("accessToken");

document.querySelector("#log-out").onclick = () => {
	localStorage.removeItem("accessToken");
};

const getUser = async () => {
	const res = await fetch("/api/user", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${profile_token}`,
		},
	});

	const data = await res.json();

	document.querySelector("#pop-up-username").textContent = data.user.username;
	document.querySelector("#pop-up-image").src = data.user.profile_picture;
};
getUser();
