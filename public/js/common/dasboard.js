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
	if (data.role === "staff" || data.role === "lecturer") {
		console.log("Valid user");
	} else if (data.role === "No Token") {
		window.location.assign("/");
	} else {
		window.location.replace("/invalid_user");
	}
};

redirect();

let free = 0;
let reserved = 0;
let pending = 0;
let disable = 0;
let counter = 0;
let stats;
let data;
let options;
let chart;

const fetchStats = async () => {
	const res = await fetch("/api/dashboard", {
		method: "GET",
	});

	stats = await res.json();

	for (let i = 0; i < stats.result.length - 1; i++) {
		free += stats.result[i].free;
		reserved += stats.result[i].reserved;
		pending += stats.result[i].pending;
		disable += stats.result[i].disable;
	}

	document.querySelector("#total-room-number").textContent =
		stats.result[4].total_room_number;

	google.charts.load("current", { packages: ["corechart"] });
	google.charts.setOnLoadCallback(drawChart);
};
fetchStats();

function drawChart() {
	data = google.visualization.arrayToDataTable([
		["Slots", "In Numbers"],
		["Free", free],
		["Pending", pending],
		["Reserved", reserved],
		["Disabled", disable],
	]);

	options = {
		title: "Slots Statistics",
		titleTextStyle: {
			fontName: "Wix Madefor Text",
			fontSize: 25,
			bold: true,
		},
		pieHole: 0.2,
		colors: ["#7EFF69", "#EFE15F", "#6A70FA", "FF5050"],

		chartArea: {
			left: 300,
		},
		fontSize: 15,
		fontName: "Wix Madefor Text",
		legend: {
			position: "right",
			alignment: "center",
			textStyle: {
				color: "light-gray",
				fontSize: 20,
			},
		},
		tooltip: {
			textStyle: { color: "#000000" },
			showColorCode: true,
		},
	};

	chart = new google.visualization.PieChart(
		document.getElementById("piechart"),
	);

	chart.draw(data, options);
}

document.querySelector("#slot-select").onchange = () => {
	const slot = document.querySelector("#slot-select").value;
	const slot_number = parseInt(slot);

	if (slot != "99") {
		data = google.visualization.arrayToDataTable([
			["Slots", "In Numbers"],
			["Free", stats.result[slot_number].free],
			["Pending", stats.result[slot_number].pending],
			["Reserved", stats.result[slot_number].reserved],
			["Disabled", stats.result[slot_number].disable],
		]);
	}

	if (slot == "99") {
		data = google.visualization.arrayToDataTable([
			["Slots", "In Numbers"],
			["Free", free],
			["Pending", pending],
			["Reserved", reserved],
			["Disabled", disable],
		]);
	}

	console.log(data);

	chart.draw(data, options);
};

document.querySelector("#nav-profile").onclick = () => {
	document.querySelector(".profile-popup").classList.toggle("open");
};
