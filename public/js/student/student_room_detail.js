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
	if (data.role == "student") {
		console.log("Valid user");
	} else if (data.role === "No Token") {
		window.location.assign("/");
	} else {
		window.location.replace("/invalid_user");
	}
};
redirect();

const slide = document.querySelector(".slide-show-cus");
const items = document.querySelector(".carousel-item");
const detail = document.querySelector("#details");
const schedule = document.querySelector("#schedule");
const features = document.querySelector("#features");
const loc = document.querySelector("#location");
const detailData = document.querySelector("#details-data");
const scheduleData = document.querySelector("#schedule-data");
const featuresData = document.querySelector("#features-data");
const locationData = document.querySelector("#location-data");
const backBtn = document.querySelector("#back-btn");
const reserveBtn = document.querySelector("#reserve-btn");
const first_features_section = document.querySelector(
	"#first-features-section",
);
const second_features_section = document.querySelector(
	"#second-features-section",
);
let image_data = ``;
let lat = 0.0;
let lng = 0.0;

let first_features_data = ``;
let second_features_data = ``;

const param = window.location.pathname;
const room_id = param.substring(param.lastIndexOf("/") + 1, param.length);

const showNoImg = () => {
	if (!slide.contains(items)) {
		slide.innerHTML = `<div class="carousel-item active mx-auto">
                            <div class="no-img fw-bold fs-3 text-white"> <i class="bi bi-file-earmark-image-fill"></i>No photos to show</div> 
                        </div>`;
	}
};

detail.onclick = () => {
	schedule.classList.remove(
		"border-bottom",
		"border-secondary",
		"border-2",
		"text-linkselect",
	);
	features.classList.remove(
		"border-bottom",
		"border-secondary",
		"border-2",
		"text-linkselect",
	);
	loc.classList.remove(
		"border-bottom",
		"border-secondary",
		"border-2",
		"text-linkselect",
	);

	detail.classList.add(
		"border-bottom",
		"border-secondary",
		"border-2",
		"text-linkselect",
	);

	if (detailData.classList.contains("d-none")) {
		detailData.classList.remove("d-none");
	}

	if (!scheduleData.classList.contains("d-none")) {
		scheduleData.classList.remove("d-block");
		scheduleData.classList.add("d-none");
	}
	if (!featuresData.classList.contains("d-none")) {
		featuresData.classList.remove("d-block");
		featuresData.classList.add("d-none");
	}
	if (!locationData.classList.contains("d-none")) {
		locationData.classList.remove("d-block");
		locationData.classList.add("d-none");
	}

	detailData.classList.add("d-block");
};

schedule.onclick = () => {
	detail.classList.remove(
		"border-bottom",
		"border-secondary",
		"border-2",
		"text-linkselect",
	);
	features.classList.remove(
		"border-bottom",
		"border-secondary",
		"border-2",
		"text-linkselect",
	);
	loc.classList.remove(
		"border-bottom",
		"border-secondary",
		"border-2",
		"text-linkselect",
	);

	schedule.classList.add(
		"border-bottom",
		"border-secondary",
		"border-2",
		"text-linkselect",
	);
	if (scheduleData.classList.contains("d-none")) {
		scheduleData.classList.remove("d-none");
	}

	if (!detailData.classList.contains("d-none")) {
		detailData.classList.remove("d-block");
		detailData.classList.add("d-none");
	}
	if (!featuresData.classList.contains("d-none")) {
		featuresData.classList.remove("d-block");
		featuresData.classList.add("d-none");
	}
	if (!locationData.classList.contains("d-none")) {
		locationData.classList.remove("d-block");
		locationData.classList.add("d-none");
	}

	scheduleData.classList.add("d-block");
};

features.onclick = () => {
	schedule.classList.remove(
		"border-bottom",
		"border-secondary",
		"border-2",
		"text-linkselect",
	);
	detail.classList.remove(
		"border-bottom",
		"border-secondary",
		"border-2",
		"text-linkselect",
	);
	loc.classList.remove(
		"border-bottom",
		"border-secondary",
		"border-2",
		"text-linkselect",
	);

	features.classList.add(
		"border-bottom",
		"border-secondary",
		"border-2",
		"text-linkselect",
	);

	if (featuresData.classList.contains("d-none")) {
		featuresData.classList.remove("d-none");
	}

	if (!scheduleData.classList.contains("d-none")) {
		scheduleData.classList.remove("d-block");
		scheduleData.classList.add("d-none");
	}
	if (!detailData.classList.contains("d-none")) {
		detailData.classList.remove("d-block");
		detailData.classList.add("d-none");
	}
	if (!locationData.classList.contains("d-none")) {
		locationData.classList.remove("d-block");
		locationData.classList.add("d-none");
	}

	featuresData.classList.add("d-block");
};

loc.onclick = () => {
	schedule.classList.remove(
		"border-bottom",
		"border-secondary",
		"border-2",
		"text-linkselect",
	);
	features.classList.remove(
		"border-bottom",
		"border-secondary",
		"border-2",
		"text-linkselect",
	);
	detail.classList.remove(
		"border-bottom",
		"border-secondary",
		"border-2",
		"text-linkselect",
	);

	loc.classList.add(
		"border-bottom",
		"border-secondary",
		"border-2",
		"text-linkselect",
	);

	if (locationData.classList.contains("d-none")) {
		locationData.classList.remove("d-none");
	}

	if (!scheduleData.classList.contains("d-none")) {
		scheduleData.classList.remove("d-block");
		scheduleData.classList.add("d-none");
	}
	if (!detailData.classList.contains("d-none")) {
		detailData.classList.remove("d-block");
		detailData.classList.add("d-none");
	}
	if (!featuresData.classList.contains("d-none")) {
		featuresData.classList.remove("d-block");
		featuresData.classList.add("d-none");
	}

	locationData.classList.add("d-block");
	let map = new L.map("map", {
		center: [lat, lng],
		zoom: 30,
	});

	let layer = new L.TileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png");
	map.addLayer(layer);
	L.marker([lat, lng]).addTo(map);
};

//update status color
const updateScheduleStatus = () => {
	//update status color
	document.querySelectorAll(".schedule-value").forEach((status) => {
		if (status.innerHTML == "free") {
			status.classList.add("text-free");
		} else if (status.innerHTML == "reserved") {
			status.classList.add("text-reserved");
		} else if (status.innerHTML == "pending") {
			status.classList.add("text-pending");
		} else if (status.innerHTML == "disable") {
			status.classList.add("text-disabled");
		} else {
			status.classList.add("text-secondary");
		}
	});
};

//Backend JS
//fetchFeaures
const fetchFeatures = async () => {
	const result = await fetch("/api/features", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const features = await result.json();
	features.features.forEach((f, i) => {
		if (i < 4) {
			first_features_data += `<div class="d-flex gap-3 align-items-center">
			<span class="features-label text-greytext fs-5 fw-semibold"
				>${f.feature_name} :
			</span>
			<i class="bi bi-check-lg d-none features-tick" id=${f.id}></i>
		</div>`;
		} else {
			second_features_data += `<div class="d-flex gap-3 align-items-center">
			<span class="features-label text-greytext fs-5 fw-semibold"
				>${f.feature_name} :
			</span>
			<i class="bi bi-check-lg d-none features-tick" id=${f.id}></i>
		</div>`;
		}
	});
	first_features_section.innerHTML = first_features_data;
	second_features_section.innerHTML = second_features_data;
};
fetchFeatures();

//fetchData
const fetchRoomData = async () => {
	const result = await fetch(`/api/room/${room_id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const data = await result.json();

	//Details
	document.querySelector("#room-type").innerHTML = data.result.room_type;
	document.querySelector("#room-number").innerHTML = data.result.room_number;
	document.querySelector("#building-number").innerHTML =
		data.result.building_number;
	document.querySelector("#capacity").innerHTML = data.result.capacity;

	//Schedule
	document.querySelector("#timeslot1").innerHTML = data.result.timeslot1_status;
	document.querySelector("#timeslot2").innerHTML = data.result.timeslot2_status;
	document.querySelector("#timeslot3").innerHTML = data.result.timeslot3_status;
	document.querySelector("#timeslot4").innerHTML = data.result.timeslot4_status;
	//update status color and hide checkboxes
	updateScheduleStatus();

	//Features
	if (data.result.features.length > 0) {
		data.result.features.forEach((id) => {
			document.querySelectorAll(".features-tick").forEach((tick) => {
				console.log(id, tick.id);
				if (id == tick.id) {
					tick.classList.remove("d-none");
				}
			});
		});
	}

	//location
	lat = data.result.lat;
	lng = data.result.lng;

	//Images
	if (data.result.images.length > 0) {
		data.result.images.forEach((image) => {
			image_data += `<div class="carousel-item active" data-bs-interval="7000">
			<img src= ${image} class="d-block w-100 img" />
			</div>`;
		});

		while (slide.firstChild) {
			slide.removeChild(slide.firstChild);
		}

		slide.innerHTML = image_data;
	}
};
fetchRoomData();

reserveBtn.onclick = () => {
	window.location.assign(`/reserve_room/${room_id}`);
};

backBtn.onclick = () => {
	window.history.back();
};

document.querySelector("#nav-profile").onclick = () => {
	document.querySelector(".profile-popup").classList.toggle("open");
};

showNoImg();
