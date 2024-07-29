const accessToken = localStorage.getItem("accessToken");
const param = window.location.pathname;
const booking_id = param.substring(param.lastIndexOf("/") + 1, param.length);

const redirect = async () => {
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

const fetchBookingDetail = async () => {
	const res = await fetch(`/api/booking_detail/${booking_id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const data = await res.json();
	document.querySelector("#req-notes").textContent = data.result.request_note;
	document.querySelector("#reason").textContent = data.result.reason;
	document.querySelector("#time-slot").textContent = data.result.time_slot;
	document
		.querySelector("#document")
		.setAttribute("href", data.result.document);
};
fetchBookingDetail();

const validateBooking = async (validation) => {
	const note = document.querySelector("#note").value;

	console.log(note, booking_id, validation);
	const res = await fetch("/api/booking_validation", {
		method: "PUT",
		body: JSON.stringify({
			booking_id,
			note,
			validation,
		}),
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${accessToken}`,
		},
	});
	const message = await res.json();
	if (message.message == "Validated successfully!") {
		Swal.fire({
			icon: "success",
			title: message.message,
		}).then(() => {
			window.location.assign("/book_requests");
		});
	} else {
		Swal.fire({
			icon: "warning",
			title: message.message,
		});
	}
};

//back btn
document.querySelector("#backbtn").onclick = () => {
	// back to previous page
	window.history.back();
};

//Modal
const showModal = (message, validation) => {
	Swal.fire({
		icon: "warning",
		title: `Do you want to ${message}?`,
		showCancelButton: true,
		confirmButtonText: "Yes",
	}).then((result) => {
		if (result.isConfirmed) {
			validateBooking(validation);
		}
	});
};
document.querySelector("#approvebtn").onclick = () => {
	showModal("approve", "approved");
};
document.querySelector("#disappbtn").onclick = () => {
	showModal("disapprove", "disapproved");
};

document.querySelector("#nav-profile").onclick = () => {
	document.querySelector(".profile-popup").classList.toggle("open");
};
