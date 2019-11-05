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
	get_verify: 'SELECT * FROM verify v, users u WHERE v.is_verified = \'FALSE\' AND u.username = v.duname',
	add_verify: 'UPDATE verify SET is_verified = \'TRUE\' WHERE duname = $1',  // insert into verify with admin name = NULL and is_verified = FALSE, admin will manually verify the driver
	check_user_is_admin: 'SELECT * FROM admin a WHERE a.username = $1', 
	check_driver_able_to_add_rides: 'SELECT * from verify v WHERE v.duname = $1 AND is_verified = TRUE', // check is driver registered and verified by admin
	approve_verified_driver: 'UPDATE verify SET auname = $1, is_verified = TRUE WHERE duname = $2', // approves driver, check data.rowCount == 1 for successful verification
	get_driver_rides: 'SELECT * FROM RIDES WHERE username = $1', 
	get_favourite_driver: 'SELECT * FROM likes WHERE puname = $1',
	get_bookmarks: 'SELECT * FROM bookmarks WHERE puname = $1',
	check_driver_exists_and_verified: 'SELECT duname, is_verified FROM driver d, verify v WHERE d.username = v.duname AND d.username = $1', //return one row which is the driver is in database, 0 rows if dont have
	driver_rating: 'SELECT ROUND(AVG(rating),2) FROM ratings GROUP BY duname HAVING duname = $1',
	rides_search: 'SELECT * FROM rides r WHERE r.pickup = $1 AND r.dropoff = $2',
	individualRide: 'SELECT * FROM rides r,bids b WHERE r.pickup = $1 AND r.dropoff = $2 AND r.ride_date = $3  AND r.start_time = $4 AND r.username = $5 AND b.pickup = $1 AND b.dropoff = $2 AND b.ride_date = $3  AND b.start_time = $4 AND b.duname = $5 ORDER BY b.amount DESC LIMIT 3'

}

module.exports = sql