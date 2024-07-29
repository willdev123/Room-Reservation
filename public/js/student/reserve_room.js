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
	if (data.role === "student") {
		console.log("Valid user");
	} else if (data.role === "No Token") {
		window.location.assign("/");
	} else {
		window.location.replace("/invalid_user");
	}
};
redirect();

const file_input = document.querySelector("#file-input");
const reserveBtn = document.querySelector("#reserve-btn");
const backBtn = document.querySelector("#back-btn");
let data = ``;

const param = window.location.pathname;
const room_id = param.substring(param.lastIndexOf("/") + 1, param.length);
const token = localStorage.getItem("accessToken");

fetchRoomData = async () => {
	const d = new Date();
	let hour = d.getHours();
	let flag = true;

	const result = await fetch(`/api/room/${room_id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const data = await result.json();

	// Show room number and room type
	document.querySelector("#room-type").innerHTML = data.result.room_type;
	document.querySelector("#room-number").innerHTML = data.result.room_number;

	// Show time slots with free and later than current hour
	if (
		data.result.timeslot1_status != "free" &&
		data.result.timeslot2_status != "free" &&
		data.result.timeslot3_status != "free" &&
		data.result.timeslot4_status != "free"
	) {
		document.querySelector("#no_slot_text").classList.remove("d-none");
		flag = false;
	}
	if (data.result.timeslot1_status == "free" && hour < 8) {
		document.querySelector("#slot1").classList.remove("d-none");
		flag = false;
	}
	if (data.result.timeslot2_status == "free" && hour < 10) {
		document.querySelector("#slot2").classList.remove("d-none");
		flag = false;
	}
	if (data.result.timeslot3_status == "free" && hour < 12) {
		document.querySelector("#slot3").classList.remove("d-none");
		flag = false;
	}
	if (data.result.timeslot4_status == "free" && hour < 14) {
		document.querySelector("#slot4").classList.remove("d-none");
		flag = false;
	}
	if (flag) {
		document.querySelector("#no_slot_text").classList.remove("d-none");
	}
};
fetchRoomData();

file_input.onchange = () => {
	let filePath = file_input.value;

	let fileName = filePath.substr(
		filePath.lastIndexOf(`\\`) + 1,
		filePath.length,
	);

	data = `${fileName}`;

	document.querySelector("#file-name").innerHTML = data;
};

const createBooking = async () => {
	const timeslot = document.querySelector("#time-slot").value;
	const request_note = document.querySelector("#request_note").value;
	const reason = document.querySelector("#reason").value;

	console.log(file_input.files[0]);

	let data = new FormData();
	data.append("room_id", room_id);
	data.append("timeslot", timeslot);
	data.append("request_note", request_note);
	data.append("reason", reason);
	data.append("document", file_input.files[0]);

	const res = await fetch("/api/booking", {
		method: "POST",
		body: data,
		headers: {
			authorization: `Bearer ${token}`,
		},
	});

	const message = await res.json();

	if (message.message == "Room booked successfully!") {
		Swal.fire({
			icon: "success",
			title: message.message,
		}).then(() => {
			window.location.assign("/check_booking");
		});
	} else {
		Swal.fire({
			icon: "warning",
			title: message.message,
		});
	}
};

reserveBtn.onclick = () => {
	const timeslot = document.querySelector("#time-slot").value;

	if (timeslot == "no slot") {
		Swal.fire({
			icon: "warning",
			title: "No timeslot selected",
		});
	} else {
		Swal.fire({
			icon: "warning",
			title: "Do you confirm to reserve?",
			showCancelButton: true,
			confirmButtonText: "Confirm",
		}).then((result) => {
			if (result.isConfirmed) {
				createBooking();
			} else if (result.isDenied) {
				Swal.fire({
					icon: "info",
					title: "Not saved!",
				});
			}
		});
	}
};

backBtn.onclick = () => {
	window.history.back();
};

document.querySelector("#nav-profile").onclick = () => {
	document.querySelector(".profile-popup").classList.toggle("open");
};
