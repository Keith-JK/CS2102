DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS Driver CASCADE;
DROP TABLE IF EXISTS Passenger CASCADE;
DROP TABLE IF EXISTS Admin CASCADE;
DROP TABLE IF EXISTS Verify CASCADE;
DROP TABLE IF EXISTS Car CASCADE;
DROP TABLE IF EXISTS Drives CASCADE;
DROP TABLE IF EXISTS Rides CASCADE;
DROP TABLE IF EXISTS Bids CASCADE;
DROP TABLE IF EXISTS Ratings CASCADE;
DROP TABLE IF EXISTS Likes CASCADE;
DROP TABLE IF EXISTS Bookmarks CASCADE;
DROP TABLE IF EXISTS Messages CASCADE;

CREATE TABLE Users (
	username varchar(100),
	name varchar(100) NOT NULL,
	password varchar(100) NOT NULL,
	PRIMARY KEY (username)
);

CREATE TABLE Driver (
	username varchar(100) REFERENCES Users,
	name varchar(100) NOT NULL,
	PRIMARY KEY (username)
);

CREATE TABLE Passenger (
	username varchar(100) REFERENCES Users,
	name varchar(100) NOT NULL,
	PRIMARY KEY (username)
);

CREATE TABLE Admin (
	username varchar(100) REFERENCES Users,
	name varchar(100) NOT NULL,
	PRIMARY KEY (username)
);

CREATE TABLE Verify (
	auname varchar(100) REFERENCES Admin,
	duname varchar(100) REFERENCES Driver,
	since date DEFAULT NULL,
	is_verified boolean DEFAULT FALSE
);

CREATE TABLE Car (
	plateNumber varchar(10) PRIMARY KEY,
	model varchar(100) NOT NULL,
	capacity integer NOT NULL
);

CREATE TABLE Drives (
	username varchar(100) NOT NULL UNIQUE,
	plateNumber varchar(10) NOT NULL UNIQUE,
	FOREIGN KEY (username) REFERENCES Driver,
	FOREIGN KEY (plateNumber) REFERENCES Car,
	PRIMARY KEY(username, plateNumber)
);

CREATE TABLE Rides (
	username varchar(100) NOT NULL REFERENCES Driver,
	pickup varchar(100) NOT NULL,
	dropoff varchar(100) NOT NULL,
	ride_date date NOT NULL,
	start_time time NOT NULL,
	capacity integer NOT NULL,
	is_complete BOOLEAN DEFAULT FALSE,
	PRIMARY KEY(username, pickup, dropoff, ride_date, start_time)
);

CREATE TABLE Bids (
	puname varchar(100) REFERENCES Passenger,
	duname varchar(100) REFERENCES Driver,
	pickup varchar(100) NOT NULL,
	dropoff varchar(100) NOT NULL,
	ride_date date NOT NULL,
	start_time time NOT NULL,
	FOREIGN KEY(duname, pickup, dropoff, ride_date, start_time) REFERENCES Rides,
	PRIMARY KEY(puname, duname, pickup, dropoff, ride_date, start_time),
	amount numeric,
	is_win boolean DEFAULT FALSE,
	CHECK (puname <> duname)
);

-- Edited
	CREATE TABLE Ratings (
		puname varchar(100),
		duname varchar(100),
		rating integer, 
		pickup varchar(100) NOT NULL,
		dropoff varchar(100) NOT NULL,
		ride_date date NOT NULL,
		start_time time NOT NULL,
		CHECK ((rating IS NULL) OR (rating >=0 AND rating <= 5)),
		FOREIGN KEY (puname, duname, pickup, dropoff, ride_date, start_time) REFERENCES Bids,
		PRIMARY KEY (puname, duname, pickup, dropoff, ride_date, start_time, rating)
	);

-- Edited
CREATE TABLE Likes (
	puname varchar(100) REFERENCES Passenger,
	duname varchar(100) REFERENCES Driver,
	PRIMARY KEY (puname, duname)
);

-- Edited		
CREATE TABLE Bookmarks (
	puname varchar(100) REFERENCES Passenger,
	pickup varchar(100) NOT NULL,
	dropoff varchar(100) NOT NULL,
	PRIMARY KEY (puname, pickup, dropoff)
);

CREATE TABLE Messages (
	sender varchar(100) REFERENCES Users,
	receiver varchar(100) REFERENCES Users,
	message varchar (500) NOT NULL,
	sent_time time NOT NULL,
	PRIMARY KEY (sender, receiver, time)
);


INSERT INTO Users VALUES ('A', 'nameA', 'A');
INSERT INTO Users VALUES ('B', 'nameB', 'B');
INSERT INTO Users VALUES ('C', 'nameC', 'C');
INSERT INTO Users VALUES ('D', 'nameD', 'D');
INSERT INTO Users VALUES ('E', 'nameE', 'E');
INSERT INTO Users VALUES ('F', 'nameF', 'F');
INSERT INTO Users VALUES ('G', 'nameG', 'G');
INSERT INTO Users VALUES ('H', 'nameH', 'H');
INSERT INTO Users VALUES ('I', 'nameI', 'I');
INSERT INTO Users VALUES ('J', 'nameJ', 'J');
INSERT INTO Users VALUES ('Z', 'nameZ', 'Z');

INSERT INTO Driver VALUES ('A', 'nameA');
INSERT INTO Driver VALUES ('B', 'nameB');
INSERT INTO Driver VALUES ('C', 'nameC');
INSERT INTO Driver VALUES ('D', 'nameD');
INSERT INTO Driver VALUES ('E', 'nameE');

INSERT INTO Passenger VALUES ('E', 'nameE');
INSERT INTO Passenger VALUES ('F', 'nameF');
INSERT INTO Passenger VALUES ('G', 'nameG');
INSERT INTO Passenger VALUES ('H', 'nameH');
INSERT INTO Passenger VALUES ('I', 'nameI');
INSERT INTO Passenger VALUES ('J', 'nameJ');

INSERT INTO Admin VALUES ('Z', 'nameZ');

INSERT INTO Verify VALUES ('Z', 'A', '1-1-2018');
INSERT INTO Verify VALUES ('Z', 'B', '1-1-2018');
INSERT INTO Verify VALUES ('Z', 'C', '1-1-2018');
INSERT INTO Verify VALUES ('Z', 'D', '1-1-2018');
INSERT INTO Verify VALUES ('Z', 'E', '1-1-2018');

INSERT INTO Car VALUES ('A100', 'car1', 2);
INSERT INTO Car VALUES ('B359', 'car2', 4);
INSERT INTO Car VALUES ('C856', 'car3', 6);
INSERT INTO Car VALUES ('D874', 'car1', 2);
INSERT INTO Car VALUES ('E390', 'car2', 4);

INSERT INTO Drives VALUES ('A', 'A100');
INSERT INTO Drives VALUES ('B', 'B359');
INSERT INTO Drives VALUES ('C', 'C856');
INSERT INTO Drives VALUES ('D', 'D874');
INSERT INTO Drives VALUES ('E', 'E390');

INSERT INTO Rides VALUES ('A', 'EAST', 'NORTH', '1-1-2019', '12:00:00', 2);
INSERT INTO Rides VALUES ('A', 'EAST', 'NORTH', '1-1-2019', '16:00:00', 2);
INSERT INTO Rides VALUES ('B', 'WEST', 'CENTRAL', '1-1-2019', '14:00:00', 2);
INSERT INTO Rides VALUES ('B', 'WEST', 'CENTRAL', '1-1-2019', '16:00:00', 2);
INSERT INTO Rides VALUES ('C', 'North', 'SOUTH', '1-1-2019', '16:00:00', 2);
INSERT INTO Rides VALUES ('D', 'SOUTH', 'WEST', '1-1-2019', '12:00:00', 2);
INSERT INTO Rides VALUES ('E', 'CENTRAL', 'EAST', '1-1-2019', '14:00:00', 2);

-- test for driver history
INSERT INTO Rides VALUES ('E', 'CENTRAL', 'EAST', '1-1-2019', '09:00:00', 2, true);

-- test for bid > capacity + different prices
INSERT INTO Bids VALUES ('E', 'A', 'EAST', 'NORTH', '1-1-2019', '12:00:00', '10');
INSERT INTO Bids VALUES ('F', 'A', 'EAST', 'NORTH', '1-1-2019', '12:00:00', '9');
INSERT INTO Bids VALUES ('G', 'A', 'EAST', 'NORTH', '1-1-2019', '12:00:00', '8');

INSERT INTO Bids VALUES ('H', 'A', 'EAST', 'NORTH', '1-1-2019', '16:00:00', '10');
INSERT INTO Bids VALUES ('I', 'A', 'EAST', 'NORTH', '1-1-2019', '16:00:00', '9');
INSERT INTO Bids VALUES ('J', 'A', 'EAST', 'NORTH', '1-1-2019', '16:00:00', '8');

-- test for bid < capacity
INSERT INTO Bids VALUES ('E', 'B', 'WEST', 'Central', '1-1-2019', '14:00:00', '10');

-- test for all 3 bid same price same ride but > capacity
INSERT INTO Bids VALUES ('E', 'C', 'NORTH', 'SOUTH', '1-1-2019', '16:00:00', '10');
INSERT INTO Bids VALUES ('F', 'C', 'NORTH', 'SOUTH', '1-1-2019', '16:00:00', '10');
INSERT INTO Bids VALUES ('G', 'C', 'NORTH', 'SOUTH', '1-1-2019', '16:00:00', '10');

-- test for is_win = true for history
INSERT INTO Bids VALUES ('H', 'E', 'CENTRAL', 'EAST', '1-1-2019', '09:00:00','10', true);
INSERT INTO Bids VALUES ('I', 'E', 'CENTRAL', 'EAST', '1-1-2019', '09:00:00','9', true);
INSERT INTO Bids VALUES ('J', 'E', 'CENTRAL', 'EAST', '1-1-2019', '09:00:00','8');


INSERT INTO Ratings VALUES ('H', 'E', '5', 'CENTRAL', 'EAST', '1-1-2019', '09:00:00');
INSERT INTO Ratings VALUES ('I', 'E', '2', 'CENTRAL', 'EAST', '1-1-2019', '09:00:00');

INSERT INTO Likes VALUES ('E', 'A');
INSERT INTO Likes VALUES ('F', 'B');
INSERT INTO Likes VALUES ('G', 'C');
INSERT INTO Likes VALUES ('H', 'D');
INSERT INTO Likes VALUES ('I', 'E');
INSERT INTO Likes VALUES ('J', 'A');


INSERT INTO Bookmarks VALUES ('F', 'NORTH', 'SOUTH');
INSERT INTO Bookmarks VALUES ('G', 'NORTH', 'SOUTH');
INSERT INTO Bookmarks VALUES ('H', 'CENTRAL', 'EAST');
INSERT INTO Bookmarks VALUES ('I', 'EAST', 'NORTH');

CREATE OR REPLACE FUNCTION check_previous_bid ()
RETURNS TRIGGER AS $$
	DECLARE count NUMERIC;
	BEGIN
	SELECT COUNT(*) INTO count FROM Bids b
	WHERE NEW.puname = b.puname AND
	NEW.duname = b.puname AND
	NEW.pickup = b.pickup AND
	NEW.dropoff = b.dropoff AND
	NEW.ride_date = b.ride_date AND 
	NEW.start_time = b.start_time;
	
	IF count > 0 THEN 
	RETURN UPDATE (OLD.puname, OLD.duname, OLD.pickup, OLD.dropoff, OLD.ride_date, OLD.start_time, NEW.amount);

	ELSE RETURN NEW;
	ENDIF;

	END; 

$$ LANGUAGE plpgsql;

CREATE TRIGGER check_bid_insert()
BEFORE INSERT OR UPDATE ON Bids
EXECUTE PROCEDURE check_previous_bid();