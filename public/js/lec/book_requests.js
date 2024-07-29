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
	if (data.role === "lecturer") {
		console.log("Valid user");
	} else if (data.role === "No Token") {
		window.location.assign("/");
	} else {
		window.location.replace("/invalid_user");
	}
};

redirect();

var today = new Date();
var options = { day: "numeric", month: "long", year: "numeric" };
var formattedDate = today.toLocaleDateString("en-US", options);

const showBookings = async () => {
	let data_show = ``;

	const res = await fetch("/api/pending_booking", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const data = await res.json();
	console.log(data);

	if (data.message) {
		data_show += `<p class="fs-2 p-3 ">${data.message}</p>`;
	} else {
		data.result.forEach((d) => {
			document.querySelector("#header").textContent = `${formattedDate}`;
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
                    <h4 class="text-header fw-bolder">Room Details</h4>
                    <hr />
                    <div class="d-flex flex-column gap-2 mt-3">
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
                    <div class="d-flex flex-column gap-2 mt-3">
                        <div class="d-flex gap-3">
                            <span class="book-label text-greytext fw-medium fs-6"
                                >Student :
                            </span>
                            <span class="book-value fw-bold fs-6 text-cusprimary"> ${d.student}</span>
                        </div>
                        <div class="d-flex gap-3">
                            <span class="book-label text-greytext fw-medium fs-6"
                                >Time slot:
                            </span>
                            <span class="book-value text-greytext fw-bold fs-6">
                                ${d.timeslot}</span
                            >
                        </div>
                        <div class="d-flex gap-3">
                            <span class="book-label text-greytext fw-medium fs-6"
                                >Booking Time:
                            </span>
                            <span class="book-value text-greytext fw-bold fs-6">
                                ${d.booking_time}</span
                            >
                        </div>
                    </div>
                </div>
                <a href="/reserve_detail/${d.booking_id}" class="btn text-white fw-semibold bg-cusbtnprimary ms-auto" style="width: 5rem"
                >Detail</a>
            </div>
        </div>`;
		});
	}

	document.querySelector("#bookings-data").innerHTML = data_show;
};

document.querySelector("#nav-profile").onclick = () => {
	document.querySelector(".profile-popup").classList.toggle("open");
};

showBookings();
