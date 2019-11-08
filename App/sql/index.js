const sql = {}

// THIS IS TO BE USED FOR ALL THE QUERIES THAT WE NEED CAN FOLLOW THE EXAMPLE BELOW
sql.query = {

	
	all_rides: 'SELECT * FROM RIDES WHERE is_complete = FALSE',
	check_username: 'SELECT * FROM Users where username = $1',
	add_user: 'INSERT INTO users (username, name, password) VALUES($1, $2, $3)',
	add_driver: 'INSERT INTO driver (username, name) VALUES ($1, $2)',
	add_passenger: 'INSERT INTO passenger (username, name) VALUES ($1, $2)',
	add_bid: 'INSERT INTO bids (puname, duname, pickup, dropoff, ride_date, start_time, amount) VALUES ($1,$2,$3,$4,$5,$6,$7)',
	add_ride: 'INSERT INTO rides (username, pickup, dropoff, ride_date, start_time, capacity) VALUES ($1,$2,$3,$4,$5,$6)',
	add_bookmark: 'INSERT INTO bookmarks (puname, pickup, dropoff) VALUES ($1, $2, $3)',
	userpass: 'SELECT username,password FROM users WHERE EXISTS (SELECT 1 FROM users WHERE username = $1 AND password = $2) WHERE username = $1 AND password = $2',
	add_car: 'INSERT INTO car (platenumber, model, capacity) VALUES($1,$2,$3)',
	all_car: 'SELECT * FROM car',

	// verification - driver
	get_verify: 'SELECT * FROM verify v, users u WHERE v.is_verified = \'FALSE\' AND u.username = v.duname',
	add_verify: 'UPDATE verify SET is_verified = TRUE WHERE duname = $1',
	// default admin name is Z and default is_verified = FALSE
	add_verify_request: 'INSERT INTO verify VALUES(\'Z\', $1, $2, FALSE)',
	check_user_is_admin: 'SELECT * FROM admin a WHERE a.username = $1', 
	check_driver_able_to_add_rides: 'SELECT * from verify v WHERE v.duname = $1 AND is_verified = TRUE', 
	approve_verified_driver: 'UPDATE verify SET auname = $1, is_verified = TRUE WHERE duname = $2', 
	check_driver_exists_and_verified: 'SELECT duname, is_verified FROM driver d, verify v WHERE d.username = v.duname AND d.username = $1 ', 
	check_driver_verified: 'SELECT * FROM verify WHERE duname = $1 and is_verified = TRUE',
	get_driver_rides: 'SELECT * FROM RIDES WHERE username = $1',
	
	// favourite driver 
	get_favourite_driver: 'SELECT * FROM likes WHERE puname = $1',
	check_if_driver_already_favourited: 'SELECT * FROM likes WHERE puname = $1 AND duname = $2',
	add_favourite_driver: 'INSERT INTO likes VALUES($1, $2)',

	// bookmark	
	get_bookmarks: 'SELECT * FROM bookmarks WHERE puname = $1',

	// history.js / history.ejs
	get_history_as_driver:'SELECT * FROM rides WHERE is_complete = TRUE AND username = $1',
	get_history_as_passenger:'SELECT * FROM rides NATURAL JOIN bids WHERE is_complete = TRUE AND puname = $1 AND is_win = TRUE',
	get_upcoming_rides_driver: 'SELECT * FROM rides WHERE is_complete = FALSE AND username = $1',
	get_upcoming_rides_passenger: 'SELECT * FROM rides NATURAL JOIN bids WHERE is_win = TRUE AND puname = $1 AND is_complete = FALSE', // bids won but ride not complete
	complete_upcoming_rides_driver: 'UPDATE rides SET is_complete = TRUE WHERE username = $1 AND pickup = $2 AND dropoff = $3 AND ride_date = $4 AND start_time = $5',

	driver_rating: 'SELECT ROUND(AVG(rating),2) FROM ratings GROUP BY duname HAVING duname = $1',
	rides_search: 'SELECT * FROM rides r WHERE r.pickup = $1 AND r.dropoff = $2',
	individualRide: 'SELECT * FROM rides r,bids b WHERE r.pickup = $1 AND r.dropoff = $2 AND r.ride_date = $3  AND r.start_time = $4 AND r.username = $5 AND b.pickup = $1 AND b.dropoff = $2 AND b.ride_date = $3  AND b.start_time = $4 AND b.duname = $5 ORDER BY b.amount DESC',
	update_individual_bid: 'UPDATE bids SET is_win = \'TRUE\' WHERE b.pickup = $1 AND b.dropoff = $2 AND b.ride_date = $3  AND b.start_time = $4 AND b.duname = $5 AND b.puname = $6',
	update_win_bid: 'WITH X AS (SELECT * FROM Bids b WHERE b.pickup = $1 AND b.dropoff = $2 AND b.ride_date = $3  AND b.start_time = $4 AND b.duname = $5 ORDER BY amount DESC LIMIT $6) UPDATE bids b SET is_win = \'TRUE\' FROM X WHERE b.puname = X.puname AND b.duname = X.duname AND b.pickup = X.pickup AND b.dropoff = X.dropoff AND b.start_time = X.start_time AND b.ride_date = X.ride_date' 

}

module.exports = sql