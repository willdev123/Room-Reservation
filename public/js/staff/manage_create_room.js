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
		console.log("Valid user");
	} else if (data.role === "No Token") {
		window.location.assign("/");
	} else {
		window.location.replace("/invalid_user");
	}
};

redirect();

// Front-end JS
const slide = document.querySelector(".slide-show-cus");
const items = document.querySelector(".carousel-item");
const file_input = document.querySelector("#file-input");
const removeBtn = document.querySelector(".removebtn");
const detail = document.querySelector("#details");
const features = document.querySelector("#features");
const loc = document.querySelector("#location");
const detailData = document.querySelector("#details-data");
const featuresData = document.querySelector("#features-data");
const locationData = document.querySelector("#location-data");
const backBtn = document.querySelector("#back-btn");
const saveBtn = document.querySelector("#save-btn");
const first_features_section = document.querySelector(
	"#first-features-section",
);
const second_features_section = document.querySelector(
	"#feature-second-section",
);
let lat = 0.0;
let lng = 0.0;

let data = ``;
let first_features_data = ``;
let second_features_data = ``;
let files = [];
const token = localStorage.getItem("accessToken");

const showNoImg = () => {
	if (!slide.contains(items)) {
		slide.innerHTML = `<div class="carousel-item active mx-auto">
                            <div class="no-img fw-bold fs-3 text-white"> <i class="bi bi-file-earmark-image-fill"></i>No photos to show</div> 
                        </div>`;
	}
};

file_input.onchange = () => {
	for (let i = 0; i < file_input.files.length; i++) {
		const src = URL.createObjectURL(file_input.files[i]);
		files.push(file_input.files[i]);
		if (i == 0) {
			data += `<div class="carousel-item active" data-bs-interval="7000">
                        <img src=${src} class="d-block w-100 img" />
                    </div>`;
		} else {
			data += `<div class="carousel-item" data-bs-interval="7000">
                        <img src=${src} class="d-block w-100 img" />
                    </div>`;
		}
	}

	while (slide.firstChild) {
		slide.removeChild(slide.firstChild);
	}

	slide.innerHTML = data;
};

removeBtn.onclick = () => {
	data = ``;
	files.splice(0, files.length);
	while (slide.firstChild) {
		slide.removeChild(slide.firstChild);
	}
	showNoImg();
};

detail.onclick = () => {
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

features.onclick = () => {
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
		center: [20.045763, 99.88547],
		zoom: 30,
	});

	let layer = new L.TileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png");
	map.addLayer(layer);
	var marker = L.marker([20.045763, 99.88547]).addTo(map);
	map.on("click", (e) => {
		if (marker !== null) {
			map.removeLayer(marker);
		}
		marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
		console.log(e.latlng.lat, e.latlng.lng);
		lat = e.latlng.lat;
		lng = e.latlng.lng;
	});
};

backBtn.onclick = () => {
	window.history.back();
};

//Backend JS
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
			first_features_data += `	<div class="d-flex gap-3 align-items-center">
			<span class="features-label text-greytext fs-5 fw-semibold"
				>${f.feature_name} :
			</span>
			<div class="form-check">
				<input
					class="form-check-input features-checkbox"
					type="checkbox"
					name="features-checkbox"
					value=${f.id}
					id="features-computer-checkbox" />
			</div>
		</div>`;
		} else {
			second_features_data += `<div class="d-flex gap-3 align-items-center">
			<span class="features-label text-greytext fs-5 fw-semibold"
				>${f.feature_name} :
			</span>
			<div class="form-check">
				<input
					class="form-check-input features-checkbox"
					type="checkbox"
					name="features-checkbox"
					value=${f.id}
					id="features-computer-checkbox" />
			</div>
		</div>`;
		}
	});
	first_features_section.innerHTML = first_features_data;
	second_features_section.innerHTML = second_features_data;
};
fetchFeatures();

saveBtn.onclick = async () => {
	Swal.fire({
		icon: "warning",
		title: "Do you want to save the changes?",

		showCancelButton: true,
		confirmButtonText: "Save",
	}).then((result) => {
		if (result.isConfirmed) {
			createRoom();
		} else if (result.isDenied) {
			Swal.fire({
				icon: "info",
				title: "Not saved!",
			});
		}
	});
};

const createRoom = async () => {
	// user inputs
	const room_type = document.querySelector("#room-type").value;
	const room_number = document.querySelector("#room-number").value;
	const building_number = document.querySelector("#building-number").value;
	const capacity = document.querySelector("#capacity").value;
	const features_body = [];
	const checked_features = document.querySelectorAll(
		"input[name=features-checkbox]:checked",
	);
	checked_features.forEach((checked) => {
		features_body.push(checked.value);
	});

	let data = new FormData();
	data.append("room_type", room_type);
	data.append("room_number", room_number);
	data.append("building_number", building_number);
	data.append("capacity", capacity);
	data.append("features_body", features_body);
	data.append("lat", lat);
	data.append("lng", lng);

	console.log(files);
	for (let i = 0; i < files.length; i++) {
		data.append("upload", files[i]);
	}

	const res = await fetch("/api/room", {
		method: "POST",
		body: data,
		headers: {
			authorization: `Bearer ${token}`,
		},
	});

	const message = await res.json();
	if (message.message == "Room created successfully!") {
		Swal.fire({
			icon: "success",
			title: message.message,
		}).then(() => {
			window.location.assign("/manage_rooms");
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

showNoImg();
