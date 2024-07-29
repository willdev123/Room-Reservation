const accessToken = localStorage.getItem("accessToken");
let cleanData;
const redirect = async () => {
	const res = await fetch("/redirect", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			authorization: `${accessToken}`,
		},
	});
	const data = await res.json();
	if (data.role === "student") {
		console.log("Valid user");
	} else if (data.role === "No Token") {
		window.location.assign("/");
	} else {
		window.location.replace("/invalid_user");
	}
};
redirect();

const showImg = (images) => {
	const slide = document.querySelector(".slide-show-cus");
	const items = document.querySelector(".carousel-item");
	let image_data = ``;

	if (images.length < 1) {
		console.log("a");
		image_data += `<div class="carousel-item active mx-auto">
                            <div class="no-img fw-bold fs-3 text-white"> <i class="bi bi-file-earmark-image-fill"></i>No photos to show</div> 
                        </div>`;
	} else {
		images.forEach((image) => {
			image_data += `<div class="carousel-item active" data-bs-interval="7000">
			<img src= ${image.image} class="d-block w-100 img" />
			</div>`;
		});
	}
	slide.innerHTML = image_data;
};

const fetchData = async () => {
	let booking_data = ``;
	const res = await fetch("/api/booking", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${accessToken}`,
		},
	});

	const data = await res.json();

	if (data.message) {
		booking_data += `<p class="fs-2 p-3 tex-header">${data.message}</p>`;
	} else {
		cleanData = {
			...data.result,
			notes: data.result.notes === undefined ? "" : data.result.notes,
			building_number:
				data.result.building_number === undefined
					? ""
					: data.result.building_number,
			capacity: data.result.capacity === undefined ? "" : data.result.capacity,
			validator: data.result.validator === null ? "" : data.result.validator,
		};
		booking_data += `<div
		class="row m-3 mt-4 justify-content-center align-items-center"
		id="image">
		<div id="carouselHero" class="col-lg-6 carousel slide">
			<div class="carousel-inner slide-show-cus mb-2">
			</div>
			<button
				class="carousel-control-prev"
				type="button"
				data-bs-target="#carouselHero"
				data-bs-slide="prev">
				<span
					class="carousel-control-prev-icon"
					aria-hidden="true"></span>
				<span class="visually-hidden">Previous</span>
			</button>
			<button
				class="carousel-control-next"
				type="button"
				data-bs-target="#carouselHero"
				data-bs-slide="next">
				<span
					class="carousel-control-next-icon"
					aria-hidden="true"></span>
				<span class="visually-hidden">Next</span>
			</button>
		</div>
	</div>

	<div class="container pt-4" id="booking-info">
		<div class="row justify-content-center align-items-center">
			<div
				class="col-lg-6 d-flex gap-3 flex-column border-end border-2 border-secondary">
				<h4
					class="text-header border-bottom border-2 border-secondary mb-3"
					style="width: 20%">
					Room Info
				</h4>
				<div class="row align-items-center g-2 mb-2" style="width: 100%">
					<span class="col-lg-3 text-greytext fw-semibold fs-5 label"
						>Room Type :
					</span>
					<span
						class="col-lg-auto text-darktext fw-bold fs-5"
						id="room-type">
						${cleanData.room_type}
					</span>
				</div>
				<div class="row align-items-center g-2 mb-2" >
					<span class="col-lg-3 text-greytext fw-semibold fs-5 label"
						>Room Number :
					</span>
					<span
						class="col-lg-auto text-darktext fw-bold fs-5"
						id="room-number">${cleanData.room_number}</span>
				</div>
				<div class="row align-items-center g-2 mb-2" style="width: 100%">
					<span class="col-lg-4 text-greytext fw-semibold fs-5 label"
						>Building Number :
					</span>
					<span
						class="col-lg-auto text-darktext fw-bold fs-5"
						id="building-number">${cleanData.building_number}</span>
				</div>
				<div class="row align-items-center g-2 mb-2">
					<span class="col-lg-3 text-greytext fw-semibold fs-5 label"
						>Capacity :
					</span>
					<span
						class="col-lg-auto text-darktext fw-bold fs-5"
						id="capacity">${cleanData.capacity}</span>
				</div>
			</div>
			<div class="col-lg-6 d-flex gap-3 flex-column">
				<h4
					class="text-header border-bottom border-2 border-secondary mb-3"
					style="width: 25%">
					Booking Info
				</h4>
				<div class="row align-items-center g-2 mb-2">
					<span class="col-lg-3 text-greytext fw-semibold fs-5 label"
						>Status :
					</span>
					<span
						class="col-lg-auto fs-5"
						id="status">
						${cleanData.status}
					</span>
				</div>
				<div class="row align-items-center g-2 mb-2">
					<span class="col-lg-3 text-greytext fw-semibold fs-5 label"
						>Time slot :
					</span>
					<span
						class="col-lg-auto text-darktext fw-bold fs-5"
						id="time-slot">${cleanData.time_slot}</span>
				</div>
				<div class="row align-items-center g-2 mb-2">
					<span class="col-lg-3 text-greytext fw-semibold fs-5 label"
						>Notes:
					</span>
					<span
						class="col-lg-auto text-darktext fw-bold fs-5"
						id="notes">${cleanData.notes}</span>
				</div>
				<div class="row align-items-center g-2 mb-2">
					<span class="col-lg-3 text-greytext fw-semibold fs-5 label"
						>Validated by :
					</span>
					<span
						class="col-lg-auto text-darktext fw-bold fs-5"
						id="validator">${cleanData.validator}</span>
				</div>
			</div>
			
		</div>
	</div>`;
	}

	document.querySelector("#booking-data").innerHTML = booking_data;

	if (data.result) {
		showImg(data.result.images);

		const status = document.querySelector("#status");
		if (
			status.textContent.includes("dis") ||
			status.textContent.includes("canceled")
		) {
			status.classList.add("text-disabled", "fw-bold");
		} else if (status.textContent.includes("approved")) {
			status.classList.add("text-free", "fw-bold");
		} else if (status.textContent.includes("pending")) {
			status.classList.add("text-pending", "fw-bold");
		} else {
			status.classList.add("text-secondary", "fw-bold");
		}

		if (data.result.status === "pending") {
			document.querySelector("#cancel-btn").classList.remove("d-none");
		}
	}
};
fetchData();

const cancelBooking = async () => {
	const booking_id = cleanData.booking_id;

	const res = await fetch("/api/booking_cancel", {
		method: "PUT",
		body: JSON.stringify({
			booking_id,
		}),
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${accessToken}`,
		},
	});

	const message = await res.json();
	if (message.message === "Booking canceled successfully!") {
		Swal.fire({
			icon: "success",
			title: message.message,
		}).then(() => {
			location.reload();
		});
	} else {
		Swal.fire({
			icon: "warning",
			title: message.message,
		});
	}
};

document.querySelector("#cancel-btn").onclick = () => {
	Swal.fire({
		icon: "warning",
		title: `Are you sure to cancel the booking?`,
		showCancelButton: true,
		confirmButtonText: "Yes",
	}).then((result) => {
		if (result.isConfirmed) {
			cancelBooking();
		}
	});
};

document.querySelector("#nav-profile").onclick = () => {
	document.querySelector(".profile-popup").classList.toggle("open");
};
