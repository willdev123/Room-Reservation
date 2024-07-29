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

let page = 1;
let limit = 6;
let room_type = "";
let room_number = "";

//Show rooms
const showRooms = async (page, limit, room_type, room_number) => {
	Notiflix.Loading.dots("Loading...", {
		backgroundColor: "rgb(255, 250, 245)",
	});
	Notiflix.Loading.remove(800);

	let data = ``;
	let res;
	if (!room_type && !room_number) {
		res = await fetch(
			`/api/rooms?page=${page}&limit=${limit}&room_type=&room_number=`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	} else if (room_type && room_number) {
		res = await fetch(
			`/api/rooms?page=${page}&limit=${limit}&room_type=${room_type}&room_number=${room_number}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	} else if (room_type && !room_number) {
		res = await fetch(
			`/api/rooms?page=${page}&limit=${limit}&room_type=${room_type}&room_number=`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	} else if (!room_type && room_number) {
		res = await fetch(
			`/api/rooms?page=${page}&limit=${limit}&room_type=&room_number=${room_number}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	}

	const rooms_data = await res.json();
	console.log(rooms_data);

	if (rooms_data.message) {
		data += `<p class="fs-2 p-3 tex-header">No rooms to show</p>`;
		document.getElementById("room-list").innerHTML = data;
		document.querySelector("#previous-btn").classList.add("d-none");
		document.querySelector("#next-btn").classList.add("d-none");
	} else if (rooms_data.result.length > 0) {
		rooms_data.result.forEach((room) => {
			data += `<div class="card shadow-sm col-lg-4 bg-cusbgsecondary">
			<div class="pt-2">
				<img
					class="card-img-top img"
					src=${room.image}
					alt="Card image cap" 
					/>
			</div>
			<div class="card-body">
				<div class="card-text">
					<div class="room-type mb-1">
						<span class="text-cussecondary fw-bolder">Room Type</span>:
						<span class="type text-cusprimary"> ${room.room_type}</span>
					</div>
					<div class="room-no mb-1">
						<span class="text-cussecondary fw-bolder">Room Number</span>:
						<span class="type text-cusprimary">${room.room_number}</span>
					</div>
	
					<div class="text-cussecondary fw-bolder">Time slots</div>
					<div class="row slots mb-3">
						<div class="col-lg-6 slots">
							<span class="text-cussecondary">8:00-10:00 am :</span
							><span class="slot1"> ${room.timeslot1_status}</span>
							<span class="text-cussecondary">10:00-12:00 pm :</span
							><span class="slot2"> ${room.timeslot2_status}</span>
						</div>
						<div class="col-lg-6 slots">
							<span class="text-cussecondary">12:00-14:00 pm :</span
							><span class="slot3"> ${room.timeslot3_status}</span>
							<span class="text-cussecondary">14:00-16:00 pm :</span
							><span class="slot4"> ${room.timeslot4_status}</span>
						</div>
					</div>
				</div>
	
				<a href="/student_room_detail/${room.id}" class="btn text-white fw-semibold bg-cusbtnprimary"
					>Detail</a
				>
			</div>
		</div>
		`;
		});
		data += `<div class="row pagination justify-content-center pb-2">
		<button
			class="btn btn-secondary col-lg-6 button me-4 px-1 text-white fw-bolder"
			id="previous-btn">
			Previous
		</button>
		<button
			class="btn btn-primary col-lg-6 button text-white fw-bolder"
			id="next-btn">
			Next
		</button>
	</div>`;
		document.getElementById("room-list").innerHTML = data;

		let slots1 = document.querySelectorAll(".slot1");
		let slots2 = document.querySelectorAll(".slot2");
		let slots3 = document.querySelectorAll(".slot3");
		let slots4 = document.querySelectorAll(".slot4");
		let slots = [slots1, slots2, slots3, slots4];
		slots.forEach((slot) => {
			slot.forEach((s) => {
				if (s.textContent.includes("free")) {
					s.classList.add("text-free", "fw-bold");
				} else if (s.textContent.includes("pending")) {
					s.classList.add("text-pending", "fw-bold");
				} else if (s.textContent.includes("reserved")) {
					s.classList.add("text-reserved", "fw-bold");
				} else if (s.textContent.includes("disable")) {
					s.classList.add("text-disabled", "fw-bold");
				} else {
					s.classList.add("text-cussecondary", "fw-bold");
				}
			});
		});

		if (!rooms_data.previous) {
			document.querySelector("#previous-btn").classList.add("d-none");
		} else {
			document.querySelector("#previous-btn").classList.remove("d-none");
		}
		if (!rooms_data.next) {
			document.querySelector("#next-btn").classList.add("d-none");
		} else {
			document.querySelector("#next-btn").classList.remove("d-none");
		}
	}
	//Next
	document.querySelector("#next-btn").onclick = () => {
		page = page + 1;
		showRooms(page, limit, room_type, room_number);
	};

	//Previous
	document.querySelector("#previous-btn").onclick = () => {
		page = page - 1;
		showRooms(page, limit, room_type, room_number);
	};
};
showRooms(page, limit, room_type, room_number);

//Search
document.querySelector("#search-btn").onclick = () => {
	page = 1;
	room_type = document.querySelector("#room_type").value;
	room_number = document.querySelector("#room_number").value;
	showRooms(page, limit, room_type, room_number);
};
document.querySelector("#nav-profile").onclick = () => {
	document.querySelector(".profile-popup").classList.toggle("open");
};
