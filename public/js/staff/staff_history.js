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

let startDate = "2001-1-1"; //
let endDate = new Date()
	.toLocaleDateString("en-GB")
	.split("/")
	.reverse()
	.join("-");
let filter = "";
document.querySelectorAll(".date").forEach((date) => {
	date.setAttribute(
		"max",
		new Date().toLocaleDateString("en-GB").split("/").reverse().join("-"),
	);
});

const showHistory = async (filter, startDate, endDate) => {
	Notiflix.Loading.dots("Loading...", {
		backgroundColor: "rgb(255, 250, 245)",
	});
	Notiflix.Loading.remove(800);
	let data_show = ``;
	const res = await fetch(
		`/api/staff_booking_history?filter=${filter}&startDate=${startDate}&endDate=${endDate}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		},
	);

	const data = await res.json();

	if (data.message) {
		data_show += `<p class="fs-2 p-3 tex-header">${data.message}</p>`;
	} else {
		const cleanData = data.result.map((d) => ({
			...d,
			building_number: d.building_number === null ? "" : d.building_number,
			capacity: d.capacity === null ? "" : d.capacity,
			validated_date: d.validated_date === null ? "" : d.validated_date,
			note: d.note === null ? "" : d.note,
		}));

		cleanData.forEach((d) => {
			data_show += `<div class="data-card bg-white border rounded mb-2 shadow">
            <div class="row justify-content-center gx-5 p-2 data">
                <div
                    class="col-lg-3 d-flex justify-content-center align-items-center">
                    <img
                        src=${d.image}
                        alt="room pic"
                        width="80%"
                        height="80%" />
                </div>
                <div class="col-lg-4 border-end border-2 border-secondary">
                    <h4 class="text-header fw-bolder">Room Info</h4>
                    <hr />
                    <div class="d-flex flex-column gap-1 mt-3">
                        <div class="d-flex gap-3">
                            <span class="room-label text-greytext fw-medium fs-6"
                                >Room type :
                            </span>
                            <span class="room-value text-greytext fw-bold fs-6">
                                ${d.room_type}</span
                            >
                        </div>
                        <div class="d-flex gap-3">
                            <span class="room-label text-greytext fw-medium fs-6"
                                >Room Number :
                            </span>
                            <span class="room-value text-greytext fw-bold fs-6"> ${d.room_number}</span>
                        </div>
                        <div class="d-flex gap-3">
                            <span class="room-label text-greytext fw-medium fs-6"
                                >Buliding Number :
                            </span>
                            <span class="room-value text-greytext fw-bold fs-6">
                                ${d.building_number}</span
                            >
                        </div>
                        <div class="d-flex gap-3">
                            <span class="room-label text-greytext fw-medium fs-6"
                                >Capacity:
                            </span>
                            <span class="room-value text-greytext fw-bold fs-6">
                                ${d.capacity}</span
                            >
                        </div>
                    </div>
                </div>
                <div class="col-lg-5">
                    <h4 class="text-header fw-bolder">Booking Info</h4>
                    <hr />
                    <div class="d-flex flex-column gap-1 mt-3">
                        <div class="d-flex gap-3">
                            <span class="book-label text-greytext fw-medium"
                                >Status :
                            </span>
                            <span class="book-value fw-bold fs-6 status-text"> ${d.status}</span>
                        </div>
                        <div class="d-flex gap-3">
                            <span class="book-label text-greytext fw-medium fs-6">Time slot:
                            </span>
                            <span class="book-value text-greytext fw-bold fs-6">
                                ${d.timeslot}</span>
                        </div>
                        <div class="d-flex gap-3">
                            <span class="book-label text-greytext fw-medium fs-6"
                                >Notes :
                            </span>
                            <span class="book-value text-greytext fw-bold fs-6"> ${d.note}</span>
                        </div>
                        <div class="d-flex gap-3">
                            <span class="book-label text-greytext fw-medium fs-6"
                                >Validated by:
                            </span>
                            <span class="book-value text-greytext fw-bold fs-6">
                                ${d.validator}</span
                            >
                        </div>
                        <div class="d-flex gap-3">
                            <span class="book-label text-greytext fw-medium fs-6"
                                >Student Name:
                            </span>
                            <span class="book-value text-greytext fw-bold fs-6">
                                ${d.student}</span
                            >
                        </div>
                        <div class="d-flex gap-3" style="width: 100%">
                            <span class="book-label text-greytext fw-medium fs-6"
                                >Booking date:
                            </span>
                            <span class="book-value text-greytext fw-bold fs-6">
                                ${d.booking_date}</span
                            >
                        </div>
                        <div class="d-flex gap-3" style="width: 100%">
                            <span class="book-label text-greytext fw-medium fs-6"
                                >Validated date:
                            </span>
                            <span class="book-value text-greytext fw-bold fs-6">
                                ${d.validated_date}</span
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
		});
	}

	document.querySelector("#history-data").innerHTML = data_show;
	const status = document.querySelectorAll(".status-text");
	status.forEach((s) => {
		if (s.textContent.includes("dis")) {
			s.classList.add("text-disabled", "fw-bold");
		} else if (s.textContent.includes("approved")) {
			s.classList.add("text-free", "fw-bold");
		} else {
			s.classList.add("text-secondary", "fw-fold");
		}
	});
};
showHistory(filter, startDate, endDate);

document.querySelector("#search-btn").onclick = async () => {
	startDate = document.querySelector("#start-date").value;
	endDate = document.querySelector("#end-date").value;
	filter = document.querySelector("#status-filter").value;
	if (startDate == "") {
		startDate = "2001-1-1";
	}
	if (endDate == "") {
		endDate = new Date().toISOString().split("T")[0];
	}

	if (new Date(endDate) < new Date(startDate)) {
		Swal.fire({
			icon: "warning",
			title: "End date must be greater than Start Date",
		});
	} else {
		showHistory(filter, startDate, endDate);
	}
};

document.querySelector("#nav-profile").onclick = () => {
	document.querySelector(".profile-popup").classList.toggle("open");
};
