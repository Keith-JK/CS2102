const sql = {}

// THIS IS TO BE USED FOR ALL THE QUERIES THAT WE NEED CAN FOLLOW THE EXAMPLE BELOW
sql.query = {


	all_rides: 'SELECT * FROM RIDES WHERE is_complete = FALSE',
	add_user: 'INSERT INTO Users VALUES (username, name, password) VALUES ($1, $2, $3)',
	add_driver: '',
	check_username: 'SELECT 1 FROM Users where username = $1',
	add_bid: 'INSERT INTO bids (puname, duname, pickup, dropoff, ride_date, start_time, amount) VALUES ($1,$2,$3,$4,$5,$6,$7)',
	add_ride: 'INSERT INTO rides (username, pickup, dropoff, ride_date, start_time, capacity) VALUES ($1,$2,$3,$4,$5,$6)',
	userpass: 'SELECT username,password FROM users WHERE EXISTS (SELECT 1 FROM users WHERE username = $1 AND password = $2) WHERE username = $1 AND password = $2',
	add_car: 'INSERT INTO car (platenumber, model, capacity) VALUES($1,$2,$3)',
	all_car: 'SELECT * FROM car',
	check_driver_verified: '', //return one row which is the driver if verified, 0 rows if dont have
	check_driver_car: '', //check if driver has car
	check_user_registered: '', //return one row which is the user is registered, 0 rows if dont have
	add_user: 'INSERT INTO username_password (username, password, status, first_name, last_name) VALUES ($1,$2,\'Bronze\',$3,$4)',
	driver_rating: '',
	rides_search: 'SELECT * FROM rides r WHERE r.pickup = $1 AND r.dropoff = $2',
	individualRide: 'SELECT * FROM rides r,bids b WHERE r.pickup = $1 AND r.dropoff = $2 AND r.ride_date = $3  AND r.start_time = $4 AND r.username = $5 AND b.pickup = $1 AND b.dropoff = $2 AND b.ride_date = $3  AND b.start_time = $4 AND b.duname = $5 ORDER BY b.amount DESC LIMIT 3'


	/*
	// Counting & Average
	count_play: 'SELECT COUNT(winner) FROM game_plays WHERE user1=$1 OR user2=$1',
	count_wins: 'SELECT COUNT(winner) FROM game_plays WHERE winner=$1',
	avg_rating: 'SELECT AVG(rating) FROM user_games INNER JOIN game_list ON user_games.gamename=game_list.gamename WHERE username=$1',
	
	// Information
	page_game: 'SELECT * FROM game_list WHERE ranking >= $1 AND ranking <= $2 ORDER BY ranking ASC',
	page_lims: 'SELECT * FROM game_list ORDER BY ranking ASC LIMIT 10 OFFSET $1',
	ctx_games: 'SELECT COUNT(*) FROM game_list',
	all_games: 'SELECT ranking,game_list.gamename AS game,rating FROM user_games INNER JOIN game_list ON user_games.gamename=game_list.gamename WHERE username=$1 ORDER BY ranking ASC',
	all_plays: 'SELECT gamename AS game, user1, user2, winner FROM game_plays WHERE user1=$1 OR user2=$1',
	
	// Insertion
	add_game: 'INSERT INTO user_games (username, gamename) VALUES($1,$2)',
	add_play: 'INSERT INTO game_plays (user1, user2, gamename, winner) VALUES($1,$2,$3,$4)',
	add_user: 'INSERT INTO username_password (username, password, status, first_name, last_name) VALUES ($1,$2,\'Bronze\',$3,$4)',
	
	// Login
	userpass: 'SELECT * FROM username_password WHERE username=$1',
	
	// Update
	update_info: 'UPDATE username_password SET first_name=$2, last_name=$3 WHERE username=$1',
	update_pass: 'UPDATE username_password SET password=$2 WHERE username=$1',
	
	// Search
	search_game: 'SELECT * FROM game_list WHERE lower(gamename) LIKE $1',
	*/
}

module.exports = sql