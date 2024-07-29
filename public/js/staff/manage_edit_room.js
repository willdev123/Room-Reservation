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

const slide = document.querySelector(".slide-show-cus");
const items = document.querySelector(".carousel-item");
const file_input = document.querySelector("#file-input");
const removeBtn = document.querySelector(".removebtn");
const detail = document.querySelector("#details");
const schedule = document.querySelector("#schedule");
const features = document.querySelector("#features");
const loc = document.querySelector("#location");
const detailData = document.querySelector("#details-data");
const scheduleData = document.querySelector("#schedule-data");
const featuresData = document.querySelector("#features-data");
const locationData = document.querySelector("#location-data");
const backBtn = document.querySelector("#back-btn");
const saveBtn = document.querySelector("#save-btn");
const detailsBtnEdit = document.querySelector("#details-editBtn");
const scheduleBtnEdit = document.querySelector("#schedule-editBtn");
const featuresBtnEdit = document.querySelector("#features-editBtn");
let showDisableHeader = false;

const first_features_section = document.querySelector(
	"#first-features-section",
);
const second_features_section = document.querySelector(
	"#second-features-section",
);

let deleteImages = false;

let image_data = ``;
let lat = 0.0;
let lng = 0.0;

let first_features_data = ``;
let second_features_data = ``;
let files = [];

const token = localStorage.getItem("accessToken");

const param = window.location.pathname;
const room_id = param.substring(param.lastIndexOf("/") + 1, param.length);

const showNoImg = () => {
	console.log("showNoImg func", slide.contains(items));
	if (!slide.contains(items)) {
		slide.innerHTML = `<div class="carousel-item active mx-auto" >
                            <div class="no-img fw-bold fs-3 text-white" id="no-img"> <i class="bi bi-file-earmark-image-fill"></i>No photos to show</div> 
                        </div>`;
	}
};

file_input.onchange = () => {
	console.log(file_input.files);
	for (let i = 0; i < file_input.files.length; i++) {
		console.log(i);
		const src = URL.createObjectURL(file_input.files[i]);
		files.push(file_input.files[i]);
		if (i == 0) {
			image_data += `<div class="carousel-item active" data-bs-interval="7000">
                        <img src=${src} class="d-block w-100 img" />
                    </div>`;
		} else {
			image_data += `<div class="carousel-item" data-bs-interval="7000">
                        <img src=${src} class="d-block w-100 img" />
                    </div>`;
		}
	}

	slide.innerHTML = image_data;
};

removeBtn.onclick = () => {
	image_data = ``;
	deleteImages = true;
	files.splice(0, files.length);
	while (slide.firstChild) {
		slide.removeChild(slide.firstChild);
	}
	showNoImg();
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
	var marker = L.marker([lat, lng]).addTo(map);
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

detailsBtnEdit.onclick = () => {
	document.querySelectorAll(".details-field").forEach((field) => {
		field.disabled = false;
	});
};

scheduleBtnEdit.onclick = () => {
	document.querySelectorAll(".schedule-checkbox").forEach((checkbox) => {
		checkbox.disabled = false;
	});
};

featuresBtnEdit.onclick = () => {
	document.querySelectorAll(".features-checkbox").forEach((checkbox) => {
		checkbox.disabled = false;
	});
};

//update status color
const updateScheduleStatus = () => {
	//update status color
	document.querySelectorAll(".schedule-value").forEach((status) => {
		if (status.innerHTML == "free") {
			showDisableHeader = true;
			status.classList.add("text-free");
		} else if (status.innerHTML == "reserved") {
			status.classList.add("text-reserved");
			hideCheckBoxes(status.id);
		} else if (status.innerHTML == "pending") {
			status.classList.add("text-pending");
			hideCheckBoxes(status.id);
		} else if (status.innerHTML == "disable") {
			status.classList.add("text-disabled");
			hideCheckBoxes(status.id);
		} else {
			status.classList.add("text-secondary");
			hideCheckBoxes(status.id);
		}
	});

	if (showDisableHeader) {
		document.querySelector("#disable-header").classList.remove("d-none");
	}
};

//hide check boxes
const hideCheckBoxes = (id) => {
	switch (id) {
		case "timeslot1":
			document.querySelector("#timeslot1-checkbox").style.visibility = "hidden";
			break;
		case "timeslot2":
			document.querySelector("#timeslot2-checkbox").style.visibility = "hidden";
			break;
		case "timeslot3":
			document.querySelector("#timeslot3-checkbox").style.visibility = "hidden";
			break;
		case "timeslot4":
			document.querySelector("#timeslot4-checkbox").style.visibility = "hidden";
			break;
	}
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
			<div class="form-check">
				<input
					class="form-check-input features-checkbox border-secondary shadow-sm feature-checkbox"
					type="checkbox"
					name="features-checkbox"
					value=${f.id}
				 disabled/>
			</div>
		</div>`;
		} else {
			second_features_data += `<div class="d-flex gap-3 align-items-center">
			<span class="features-label text-greytext fs-5 fw-semibold"
				>${f.feature_name} :
			</span>
			<div class="form-check">
				<input
					class="form-check-input features-checkbox border-secondary shadow-sm feacture-checkbox"
					type="checkbox"
					name="features-checkbox"
					value=${f.id}
					 disabled/>
			</div>
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
	document.querySelector("#room-type").value = data.result.room_type;
	document.querySelector("#room-number").value = data.result.room_number;
	document.querySelector("#building-number").value =
		data.result.building_number;
	document.querySelector("#capacity").value = data.result.capacity;

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
			document.querySelectorAll(".features-checkbox").forEach((checkbox) => {
				if (id == checkbox.value) {
					checkbox.checked = true;
				}
			});
		});
	}

	//location
	lat = data.result.lat;
	lng = data.result.lng;

	//Images

	if (data.result.images.length > 0) {
		data.result.images.forEach((image, i) => {
			if (i == 0) {
				console.log("a");
				image_data += `<div class="carousel-item active" data-bs-interval="7000">
				<img src= ${image} class="d-block w-100 img" />
				</div>`;
			} else {
				image_data += `<div class="carousel-item " data-bs-interval="7000">
				<img src= ${image} class="d-block w-100 img" />
				</div>`;
			}
		});

		slide.innerHTML = image_data;
		console.log(slide);
	} else {
		showNoImg();
		console.log(slide);
	}
};
fetchRoomData();

//put data
const saveRoomData = async () => {
	const room_type = document.querySelector("#room-type").value;
	const room_number = document.querySelector("#room-number").value;
	const building_number = document.querySelector("#building-number").value;
	const capacity = document.querySelector("#capacity").value;
	const features_body = [];
	const slots_body = [];
	const checked_features = document.querySelectorAll(
		"input[name=features-checkbox]:checked",
	);

	const checked_timeslots = document.querySelectorAll(
		"input[name=timeslots-checkbox]:checked",
	);

	checked_features.forEach((checked) => {
		features_body.push(checked.value);
	});

	checked_timeslots.forEach((checked) => {
		slots_body.push(checked.value);
	});

	let data = new FormData();
	data.append("room_id", room_id);
	data.append("room_type", room_type);
	data.append("room_number", room_number);
	data.append("building_number", building_number);
	data.append("capacity", capacity);
	data.append("features_body", features_body);
	data.append("slots_body", slots_body);
	data.append("lat", lat);
	data.append("lng", lng);
	data.append("deleteImages", deleteImages);

	console.log(files);
	console.log(deleteImages);

	for (let i = 0; i < files.length; i++) {
		data.append("upload", files[i]);
	}

	const res = await fetch("/api/room", {
		method: "PUT",
		body: data,
		headers: {
			authorization: `Bearer ${token}`,
		},
	});

	const result = await res.json();
	if (result.message == "Room edited sucessfully!") {
		Swal.fire({
			icon: "success",
			title: result.message,
		}).then(() => {
			window.location.assign("/manage_rooms");
		});
	} else {
		Swal.fire({
			icon: "warning",
			title: result.message,
		});
	}
};
saveBtn.onclick = async () => {
	Swal.fire({
		icon: "warning",
		title: "Do you want to save the changes?",
		showCancelButton: true,
		confirmButtonText: "Save",
	}).then((result) => {
		if (result.isConfirmed) {
			saveRoomData();
		}
	});
};

document.querySelector("#nav-profile").onclick = () => {
	document.querySelector(".profile-popup").classList.toggle("open");
};
