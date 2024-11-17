DROP DATABASE IF EXISTS ReelTime;
CREATE DATABASE ReelTime;
USE ReelTime;

-- Table: cinemas
DROP TABLE IF EXISTS cinemas;
CREATE TABLE cinemas (
    cinema_id INT AUTO_INCREMENT PRIMARY KEY,
    cinema_name VARCHAR(255) NOT NULL,
    cinema_address VARCHAR(255) NOT NULL,
    cinema_city VARCHAR(100) NOT NULL,
    cinema_state VARCHAR(50) NOT NULL,
    capacity INT NOT NULL
);

-- Insert cinemas data
INSERT INTO cinemas (cinema_name, cinema_address, cinema_city, cinema_state, capacity) VALUES
('North Haven Cinema', '123 Main St', 'North Haven', 'CT', 500),
('New Haven Cinema', '456 Elm St', 'New Haven', 'CT', 400);

-- Table: theaters
DROP TABLE IF EXISTS theaters;
CREATE TABLE theaters (
    theater_id INT AUTO_INCREMENT PRIMARY KEY,
    theater_name VARCHAR(255) NOT NULL,
    cinema_id INT NOT NULL,
    capacity INT NOT NULL,
    cleaned BOOLEAN NOT NULL,
    3D_Flag BOOLEAN NOT NULL,
    FOREIGN KEY (cinema_id) REFERENCES cinemas(cinema_id)
);

-- Insert theaters data
INSERT INTO theaters (theater_name, cinema_id, capacity, cleaned, 3D_Flag) VALUES
('Theater 1', 1, 200, TRUE, FALSE),
('Theater 2', 1, 300, TRUE, TRUE),
('Theater 3', 2, 150, TRUE, FALSE),
('Theater 4', 2, 250, TRUE, TRUE);

-- Table: movies
DROP TABLE IF EXISTS movies;
CREATE TABLE movies (
    movie_id INT AUTO_INCREMENT PRIMARY KEY,
    movie_title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    duration INT NOT NULL, -- in minutes
    view_rating VARCHAR(10), -- e.g., PG, R
    genre VARCHAR(255) NOT NULL,
    director VARCHAR(255) NOT NULL
);

-- Insert movie data
INSERT INTO movies (movie_id, movie_title, description, image_url, duration, view_rating, genre, director) VALUES
(1, 'Wicked', 'Fantasy musical about the witches of Oz.', 'images/wicked.jpg', 165, 'PG', 'Fantasy Musical', 'Jon M. Chu'),
(2, 'Beetlejuice 2', 'Comedy sequel about the return of Beetlejuice.', 'images/beetlejuice.jpg', 120, 'PG-13', 'Comedy Fantasy', 'Tim Burton'),
(3, 'Deadpool & Wolverine', 'Action comedy featuring Deadpool and Wolverine.', 'images/deadpoolwolverine.jpg', 150, 'R', 'Action Comedy', 'Shawn Levy'),
(4, 'Despicable Me 4', 'The latest animated adventure with Gru and the Minions.', 'images/despicableme4.jpg', 100, 'PG', 'Animated Comedy', 'Chris Renaud'),
(5, 'Inside Out 2', 'A sequel exploring new emotions and adventures.', 'images/insideout2.jpg', 105, 'PG', 'Animated Adventure', 'Kelsey Mann'),
(6, 'Moana 2', 'Moana returns for another epic adventure on the sea.', 'images/moana2.jpg', 120, 'PG', 'Animated Adventure', 'John Musker'),
(7, 'Red One', 'A festive action-comedy featuring a Christmas mission.', 'images/redone.jpg', 115, 'PG-13', 'Action Comedy', 'Jake Kasdan'),
(8, 'Speak No Evil', 'A chilling horror film about social boundaries.', 'images/speaknoevil.jpg', 95, 'R', 'Horror', 'James Watkins');


-- Table: showtimes
DROP TABLE IF EXISTS showtimes;
CREATE TABLE showtimes (
    showtime_id INT AUTO_INCREMENT PRIMARY KEY,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    tickets_available INT NOT NULL,
    theater_id INT NOT NULL,
    movie_id INT NOT NULL,
    FOREIGN KEY (theater_id) REFERENCES theaters(theater_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE
);

-- Insert showtimes for the week with 3 showtimes per day for each movie
INSERT INTO showtimes (showtime_id, movie_id, theater_id, start_time, end_time, tickets_available)
VALUES
    -- Wicked (Movie ID: 1)
    (1, 1, 1, '2024-11-22 10:00:00', '2024-11-22 12:30:00', 100),
    (2, 1, 1, '2024-11-22 15:00:00', '2024-11-22 17:30:00', 80),
    (3, 1, 1, '2024-11-22 20:00:00', '2024-11-22 22:30:00', 90),
    (4, 1, 1, '2024-11-23 10:00:00', '2024-11-23 12:30:00', 110),
    (5, 1, 1, '2024-11-23 15:00:00', '2024-11-23 17:30:00', 120),
    (6, 1, 1, '2024-11-23 20:00:00', '2024-11-23 22:30:00', 85),
    (7, 1, 1, '2024-11-24 10:00:00', '2024-11-24 12:30:00', 100),
    (8, 1, 1, '2024-11-24 15:00:00', '2024-11-24 17:30:00', 90),
    (9, 1, 1, '2024-11-24 20:00:00', '2024-11-24 22:30:00', 80),
    (10, 1, 1, '2024-11-25 10:00:00', '2024-11-25 12:30:00', 95),
    (11, 1, 1, '2024-11-25 15:00:00', '2024-11-25 17:30:00', 90),
    (12, 1, 1, '2024-11-25 20:00:00', '2024-11-25 22:30:00', 85),
    (13, 1, 1, '2024-11-26 10:00:00', '2024-11-26 12:30:00', 120),
    (14, 1, 1, '2024-11-26 15:00:00', '2024-11-26 17:30:00', 110),
    (15, 1, 1, '2024-11-26 20:00:00', '2024-11-26 22:30:00', 100),
    (16, 1, 1, '2024-11-27 10:00:00', '2024-11-27 12:30:00', 85),
    (17, 1, 1, '2024-11-27 15:00:00', '2024-11-27 17:30:00', 80),
    (18, 1, 1, '2024-11-27 20:00:00', '2024-11-27 22:30:00', 95),
    (19, 1, 1, '2024-11-28 10:00:00', '2024-11-28 12:30:00', 110),
    (20, 1, 1, '2024-11-28 15:00:00', '2024-11-28 17:30:00', 100),
    (21, 1, 1, '2024-11-28 20:00:00', '2024-11-28 22:30:00', 90),
    (22, 1, 1, '2024-11-29 10:00:00', '2024-11-29 12:30:00', 120),
    (23, 1, 1, '2024-11-29 15:00:00', '2024-11-29 17:30:00', 110),
    (24, 1, 1, '2024-11-29 20:00:00', '2024-11-29 22:30:00', 85),

    -- Beetlejuice 2 (Movie ID: 2, Theater ID: 1)
	(25, 2, 1, '2024-11-22 11:30:00', '2024-11-22 14:00:00', 100),
	(26, 2, 1, '2024-11-22 16:30:00', '2024-11-22 19:00:00', 90),
	(27, 2, 1, '2024-11-22 21:30:00', '2024-11-23 00:00:00', 85),
	(28, 2, 1, '2024-11-23 11:30:00', '2024-11-23 14:00:00', 95),
	(29, 2, 1, '2024-11-23 16:30:00', '2024-11-23 19:00:00', 105),
	(30, 2, 1, '2024-11-23 21:30:00', '2024-11-24 00:00:00', 120),
	(31, 2, 1, '2024-11-24 11:30:00', '2024-11-24 14:00:00', 90),
	(32, 2, 1, '2024-11-24 16:30:00', '2024-11-24 19:00:00', 100),
	(33, 2, 1, '2024-11-24 21:30:00', '2024-11-25 00:00:00', 110),
	(34, 2, 1, '2024-11-25 11:30:00', '2024-11-25 14:00:00', 95),
	(35, 2, 1, '2024-11-25 16:30:00', '2024-11-25 19:00:00', 85),
	(36, 2, 1, '2024-11-25 21:30:00', '2024-11-26 00:00:00', 80),
	(37, 2, 1, '2024-11-26 11:30:00', '2024-11-26 14:00:00', 100),
	(38, 2, 1, '2024-11-26 16:30:00', '2024-11-26 19:00:00', 95),
	(39, 2, 1, '2024-11-26 21:30:00', '2024-11-27 00:00:00', 90),
	(40, 2, 1, '2024-11-27 11:30:00', '2024-11-27 14:00:00', 105),
	(41, 2, 1, '2024-11-27 16:30:00', '2024-11-27 19:00:00', 110),
	(42, 2, 1, '2024-11-27 21:30:00', '2024-11-28 00:00:00', 115),
	(43, 2, 1, '2024-11-28 11:30:00', '2024-11-28 14:00:00', 120),
	(44, 2, 1, '2024-11-28 16:30:00', '2024-11-28 19:00:00', 125),
	(45, 2, 1, '2024-11-28 21:30:00', '2024-11-29 00:00:00', 130),
	(46, 2, 1, '2024-11-29 11:30:00', '2024-11-29 14:00:00', 90),
	(47, 2, 1, '2024-11-29 16:30:00', '2024-11-29 19:00:00', 100),
	(48, 2, 1, '2024-11-29 21:30:00', '2024-11-30 00:00:00', 110),


    -- Deadpool & Wolverine (Movie ID: 3, Theater ID: 2)
	(49, 3, 2, '2024-11-22 12:00:00', '2024-11-22 14:30:00', 120),
	(50, 3, 2, '2024-11-22 15:30:00', '2024-11-22 18:00:00', 110),
	(51, 3, 2, '2024-11-22 20:00:00', '2024-11-22 22:30:00', 100),
	(52, 3, 2, '2024-11-23 12:00:00', '2024-11-23 14:30:00', 130),
	(53, 3, 2, '2024-11-23 15:30:00', '2024-11-23 18:00:00', 125),
	(54, 3, 2, '2024-11-23 20:00:00', '2024-11-23 22:30:00', 110),
	(55, 3, 2, '2024-11-24 12:00:00', '2024-11-24 14:30:00', 115),
	(56, 3, 2, '2024-11-24 15:30:00', '2024-11-24 18:00:00', 100),
	(57, 3, 2, '2024-11-24 20:00:00', '2024-11-24 22:30:00', 105),
	(58, 3, 2, '2024-11-25 12:00:00', '2024-11-25 14:30:00', 95),
	(59, 3, 2, '2024-11-25 15:30:00', '2024-11-25 18:00:00', 85),
	(60, 3, 2, '2024-11-25 20:00:00', '2024-11-25 22:30:00', 120),
	(61, 3, 2, '2024-11-26 12:00:00', '2024-11-26 14:30:00', 125),
	(62, 3, 2, '2024-11-26 15:30:00', '2024-11-26 18:00:00', 130),
	(63, 3, 2, '2024-11-26 20:00:00', '2024-11-26 22:30:00', 110),
	(64, 3, 2, '2024-11-27 12:00:00', '2024-11-27 14:30:00', 100),
	(65, 3, 2, '2024-11-27 15:30:00', '2024-11-27 18:00:00', 90),
	(66, 3, 2, '2024-11-27 20:00:00', '2024-11-27 22:30:00', 95),
	(67, 3, 2, '2024-11-28 12:00:00', '2024-11-28 14:30:00', 115),
	(68, 3, 2, '2024-11-28 15:30:00', '2024-11-28 18:00:00', 120),
	(69, 3, 2, '2024-11-28 20:00:00', '2024-11-28 22:30:00', 110),
	(70, 3, 2, '2024-11-29 12:00:00', '2024-11-29 14:30:00', 125),
	(71, 3, 2, '2024-11-29 15:30:00', '2024-11-29 18:00:00', 130),
	(72, 3, 2, '2024-11-29 20:00:00', '2024-11-29 22:30:00', 135),

    -- Despicable Me 4 (Movie ID: 4, Theater ID: 2)
	(73, 4, 2, '2024-11-22 10:00:00', '2024-11-22 11:40:00', 80),
	(74, 4, 2, '2024-11-22 13:00:00', '2024-11-22 14:40:00', 75),
	(75, 4, 2, '2024-11-22 16:00:00', '2024-11-22 17:40:00', 70),
	(76, 4, 2, '2024-11-23 10:00:00', '2024-11-23 11:40:00', 85),
	(77, 4, 2, '2024-11-23 13:00:00', '2024-11-23 14:40:00', 90),
	(78, 4, 2, '2024-11-23 16:00:00', '2024-11-23 17:40:00', 95),
	(79, 4, 2, '2024-11-24 10:00:00', '2024-11-24 11:40:00', 60),
	(80, 4, 2, '2024-11-24 13:00:00', '2024-11-24 14:40:00', 65),
	(81, 4, 2, '2024-11-24 16:00:00', '2024-11-24 17:40:00', 70),
	(82, 4, 2, '2024-11-25 10:00:00', '2024-11-25 11:40:00', 50),
	(83, 4, 2, '2024-11-25 13:00:00', '2024-11-25 14:40:00', 55),
	(84, 4, 2, '2024-11-25 16:00:00', '2024-11-25 17:40:00', 60),
	(85, 4, 2, '2024-11-26 10:00:00', '2024-11-26 11:40:00', 100),
	(86, 4, 2, '2024-11-26 13:00:00', '2024-11-26 14:40:00', 95),
	(87, 4, 2, '2024-11-26 16:00:00', '2024-11-26 17:40:00', 90),
	(88, 4, 2, '2024-11-27 10:00:00', '2024-11-27 11:40:00', 80),
	(89, 4, 2, '2024-11-27 13:00:00', '2024-11-27 14:40:00', 75),
	(90, 4, 2, '2024-11-27 16:00:00', '2024-11-27 17:40:00', 70),
	(91, 4, 2, '2024-11-28 10:00:00', '2024-11-28 11:40:00', 65),
	(92, 4, 2, '2024-11-28 13:00:00', '2024-11-28 14:40:00', 60),
	(93, 4, 2, '2024-11-28 16:00:00', '2024-11-28 17:40:00', 55),
	(94, 4, 2, '2024-11-29 10:00:00', '2024-11-29 11:40:00', 75),
	(95, 4, 2, '2024-11-29 13:00:00', '2024-11-29 14:40:00', 80),
	(96, 4, 2, '2024-11-29 16:00:00', '2024-11-29 17:40:00', 85),

   -- Red One (Movie ID: 5, Theater ID: 3)
	(97, 5, 3, '2024-11-22 11:00:00', '2024-11-22 12:50:00', 100),
	(98, 5, 3, '2024-11-22 15:00:00', '2024-11-22 16:50:00', 90),
	(99, 5, 3, '2024-11-22 19:00:00', '2024-11-22 20:50:00', 80),
	(100, 5, 3, '2024-11-23 11:00:00', '2024-11-23 12:50:00', 85),
	(101, 5, 3, '2024-11-23 15:00:00', '2024-11-23 16:50:00', 95),
	(102, 5, 3, '2024-11-23 19:00:00', '2024-11-23 20:50:00', 75),
	(103, 5, 3, '2024-11-24 11:00:00', '2024-11-24 12:50:00', 70),
	(104, 5, 3, '2024-11-24 15:00:00', '2024-11-24 16:50:00', 65),
	(105, 5, 3, '2024-11-24 19:00:00', '2024-11-24 20:50:00', 60),
	(106, 5, 3, '2024-11-25 11:00:00', '2024-11-25 12:50:00', 50),
	(107, 5, 3, '2024-11-25 15:00:00', '2024-11-25 16:50:00', 55),
	(108, 5, 3, '2024-11-25 19:00:00', '2024-11-25 20:50:00', 65),
	(109, 5, 3, '2024-11-26 11:00:00', '2024-11-26 12:50:00', 70),
	(110, 5, 3, '2024-11-26 15:00:00', '2024-11-26 16:50:00', 75),
	(111, 5, 3, '2024-11-26 19:00:00', '2024-11-26 20:50:00', 80),
	(112, 5, 3, '2024-11-27 11:00:00', '2024-11-27 12:50:00', 85),
	(113, 5, 3, '2024-11-27 15:00:00', '2024-11-27 16:50:00', 90),
	(114, 5, 3, '2024-11-27 19:00:00', '2024-11-27 20:50:00', 100),
	(115, 5, 3, '2024-11-28 11:00:00', '2024-11-28 12:50:00', 95),
	(116, 5, 3, '2024-11-28 15:00:00', '2024-11-28 16:50:00', 90),
	(117, 5, 3, '2024-11-28 19:00:00', '2024-11-28 20:50:00', 85),
	(118, 5, 3, '2024-11-29 11:00:00', '2024-11-29 12:50:00', 80),
	(119, 5, 3, '2024-11-29 15:00:00', '2024-11-29 16:50:00', 75),
	(120, 5, 3, '2024-11-29 19:00:00', '2024-11-29 20:50:00', 70),

    -- Speak No Evil (Movie ID: 6, Theater ID: 4)
	(121, 6, 4, '2024-11-22 12:00:00', '2024-11-22 13:40:00', 70),
	(122, 6, 4, '2024-11-22 16:00:00', '2024-11-22 17:40:00', 80),
	(123, 6, 4, '2024-11-22 20:00:00', '2024-11-22 21:40:00', 60),
	(124, 6, 4, '2024-11-23 12:00:00', '2024-11-23 13:40:00', 65),
	(125, 6, 4, '2024-11-23 16:00:00', '2024-11-23 17:40:00', 70),
	(126, 6, 4, '2024-11-23 20:00:00', '2024-11-23 21:40:00', 55),
	(127, 6, 4, '2024-11-24 12:00:00', '2024-11-24 13:40:00', 75),
	(128, 6, 4, '2024-11-24 16:00:00', '2024-11-24 17:40:00', 80),
	(129, 6, 4, '2024-11-24 20:00:00', '2024-11-24 21:40:00', 70),
	(130, 6, 4, '2024-11-25 12:00:00', '2024-11-25 13:40:00', 85),
	(131, 6, 4, '2024-11-25 16:00:00', '2024-11-25 17:40:00', 75),
	(132, 6, 4, '2024-11-25 20:00:00', '2024-11-25 21:40:00', 65),
	(133, 6, 4, '2024-11-26 12:00:00', '2024-11-26 13:40:00', 80),
	(134, 6, 4, '2024-11-26 16:00:00', '2024-11-26 17:40:00', 90),
	(135, 6, 4, '2024-11-26 20:00:00', '2024-11-26 21:40:00', 75),
	(136, 6, 4, '2024-11-27 12:00:00', '2024-11-27 13:40:00', 95),
	(137, 6, 4, '2024-11-27 16:00:00', '2024-11-27 17:40:00', 85),
	(138, 6, 4, '2024-11-27 20:00:00', '2024-11-27 21:40:00', 80),
	(139, 6, 4, '2024-11-28 12:00:00', '2024-11-28 13:40:00', 90),
	(140, 6, 4, '2024-11-28 16:00:00', '2024-11-28 17:40:00', 75),
	(141, 6, 4, '2024-11-28 20:00:00', '2024-11-28 21:40:00', 70),
	(142, 6, 4, '2024-11-29 12:00:00', '2024-11-29 13:40:00', 65),
	(143, 6, 4, '2024-11-29 16:00:00', '2024-11-29 17:40:00', 60),
	(144, 6, 4, '2024-11-29 20:00:00', '2024-11-29 21:40:00', 55);


-- Temporarily disable safe mode
SET SQL_SAFE_UPDATES = 0;

-- Convert existing showtimes to America/New_York timezone
UPDATE showtimes
SET 
    start_time = CONVERT_TZ(start_time, '+00:00', 'America/New_York'),
    end_time = CONVERT_TZ(end_time, '+00:00', 'America/New_York')
WHERE start_time IS NOT NULL AND end_time IS NOT NULL;

-- Set timezone for the session
SET time_zone = 'America/New_York';

-- Re-enable safe mode
SET SQL_SAFE_UPDATES = 1;