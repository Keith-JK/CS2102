function check(event) {
	// Get Values
	var pickup  = req.body.pickup.toUpperCase();
	var dropoff = req.body.dropoff.toUpperCase();
	var capacity = req.body.capacity;
	var dateOfRide = req.body.dateOfRide;
	var timeOfRide = req.body.timeOfRide;
	
	// Simple Check
	if(pickup.length == 0) {
		alert("please set pickup place!");
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
	if(dropoff.length == 0) {
		alert("please set dropoff place!");
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
	if(dateOfRide == "") {
		alert("Invalid date");
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
	if(timeOfRide == "") {
		alert("Invalid time");
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
	if(capacity == 0 ) {
		alert("Not enough capacity!!!!");
		event.preventDefault();
		event.stopPropagation();
	}
}

