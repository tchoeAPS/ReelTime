const mysql = require('mysql2');
const utils = require('./utils.js');

// Database connection configuration
const connectionObj = {
    host: 'localhost',
    user: 'reeltime',
    password: 'reeltimeCSC540',
    database: 'ReelTime',
    connectionLimit: 10
};

// Fetch all movies for the dropdown
exports.getMovies = function (response) {
    let connection_pool = mysql.createPool(connectionObj);
    connection_pool.query(
        `SELECT movie_id, movie_title, description, image_url, duration, view_rating, genre, director FROM movies;`,
        function (error, results) {
            if (error) {
                console.error("Error fetching movies:", error);
                utils.sendJSONObj(response, 500, { error: "Error fetching movies." });
            } else {
                utils.sendJSONObj(response, 200, { movies: results });
            }
            connection_pool.end();
        }
    );
};

// Update a showtime with the selected movie
exports.updateShowtimeWithMovie = function (response, showtimeId, movieId) {
    let connection_pool = mysql.createPool(connectionObj);
    connection_pool.query(
        `UPDATE showtimes SET movie_id = ? WHERE showtime_id = ?;`,
        [movieId, showtimeId],
        function (error, results) {
            if (error) {
                console.error("Error updating showtime:", error);
                utils.sendJSONObj(response, 500, { error: "Error updating showtime with the selected movie." });
            } else if (results.affectedRows === 0) {
                utils.sendJSONObj(response, 404, { error: "Showtime not found or movie not updated." });
            } else {
                utils.sendJSONObj(response, 200, { message: "Showtime updated successfully." });
            }
            connection_pool.end();
        }
    );
};

// Fetch all showtimes for a theater
exports.getShowtimesByTheater = function (response, theaterId) {
    let connection_pool = mysql.createPool(connectionObj);
    connection_pool.query(
        `SELECT s.showtime_id, 
                CONVERT_TZ(s.start_time, '+00:00', 'America/New_York') AS start_time, 
                CONVERT_TZ(s.end_time, '+00:00', 'America/New_York') AS end_time, 
                s.tickets_available, 
                m.movie_title, 
                m.image_url
         FROM showtimes s
         JOIN movies m ON s.movie_id = m.movie_id
         WHERE s.theater_id = ?;`,
        [theaterId],
        function (error, results) {
            if (error) {
                console.error("Error fetching showtimes:", error);
                utils.sendJSONObj(response, 500, { error: "Error fetching showtimes." });
            } else {
                utils.sendJSONObj(response, 200, { showtimes: results });
            }
            connection_pool.end();
        }
    );
};

// Fetch showtimes by movie ID
exports.getShowtimesByMovie = function (response, movieId) {
    let connection_pool = mysql.createPool(connectionObj);
    connection_pool.query(
        `SELECT s.showtime_id, 
                CONVERT_TZ(s.start_time, '+00:00', 'America/New_York') AS start_time, 
                CONVERT_TZ(s.end_time, '+00:00', 'America/New_York') AS end_time, 
                s.tickets_available, 
                t.theater_name, 
                m.movie_title 
         FROM showtimes s 
         JOIN theaters t ON s.theater_id = t.theater_id 
         JOIN movies m ON s.movie_id = m.movie_id 
         WHERE s.movie_id = ?;`,
        [movieId],
        function (error, results) {
            if (error) {
                console.error("Error fetching showtimes by movie:", error);
                utils.sendJSONObj(response, 500, { error: "Error fetching showtimes." });
            } else {
                utils.sendJSONObj(response, 200, { showtimes: results });
            }
            connection_pool.end();
        }
    );
};

// Fetch a single showtime by ID
exports.getShowtimeById = function (response, showtimeId) {
    let connection_pool = mysql.createPool(connectionObj);
    connection_pool.query(
        `SELECT s.showtime_id, 
                CONVERT_TZ(s.start_time, '+00:00', 'America/New_York') AS start_time, 
                CONVERT_TZ(s.end_time, '+00:00', 'America/New_York') AS end_time, 
                s.tickets_available, 
                m.movie_title, 
                m.image_url, 
                t.theater_name 
         FROM showtimes s 
         JOIN movies m ON s.movie_id = m.movie_id 
         JOIN theaters t ON s.theater_id = t.theater_id 
         WHERE s.showtime_id = ?;`,
        [showtimeId],
        function (error, results) {
            if (error) {
                console.error("Error fetching showtime by ID:", error);
                utils.sendJSONObj(response, 500, { error: "Error fetching showtime details." });
            } else {
                if (results.length === 0) {
                    utils.sendJSONObj(response, 404, { error: "Showtime not found." });
                } else {
                    utils.sendJSONObj(response, 200, { showtime: results[0] });
                }
            }
            connection_pool.end();
        }
    );
};

// Update the tickets available for a showtime
exports.updateTicketsAvailable = function (response, showtimeId, tickets) {
    let connection_pool = mysql.createPool(connectionObj);
    connection_pool.query(
        `UPDATE showtimes SET tickets_available = ? WHERE showtime_id = ?;`,
        [tickets, showtimeId],
        function (error, results) {
            if (error) {
                console.error("Error updating tickets:", error);
                utils.sendJSONObj(response, 500, { error: "Error updating tickets." });
            } else if (results.affectedRows === 0) {
                utils.sendJSONObj(response, 404, { error: "Showtime not found or tickets not updated." });
            } else {
                utils.sendJSONObj(response, 200, { message: "Tickets updated successfully." });
            }
            connection_pool.end();
        }
    );
};

// Fetch all theaters
exports.getTheaters = function (response) {
    let connection_pool = mysql.createPool(connectionObj);
    connection_pool.query(
        `SELECT theater_id, theater_name, cinema_id, capacity, cleaned, 3D_Flag FROM theaters;`,
        function (error, results) {
            if (error) {
                console.error("Error fetching theaters:", error);
                utils.sendJSONObj(response, 500, { error: "Error fetching theaters." });
            } else {
                utils.sendJSONObj(response, 200, { theaters: results });
            }
            connection_pool.end();
        }
    );
};

// Add a new showtime
exports.addShowtime = function (response, startTime, endTime, tickets, theaterId, movieId) {
    let connection_pool = mysql.createPool(connectionObj);
    connection_pool.query(
        `INSERT INTO showtimes (start_time, end_time, tickets_available, theater_id, movie_id) 
         VALUES (?, ?, ?, ?, ?);`,
        [startTime, endTime, tickets, theaterId, movieId],
        function (error, results) {
            if (error) {
                console.error("Error adding showtime:", error);
                utils.sendJSONObj(response, 500, { error: "Error adding showtime." });
            } else {
                utils.sendJSONObj(response, 201, { message: "Showtime added successfully.", showtimeId: results.insertId });
            }
            connection_pool.end();
        }
    );
};
