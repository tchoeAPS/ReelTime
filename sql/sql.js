export const getAllMovies = `
SELECT 
  movie_id, 
  movie_title, 
  description, 
  image_url, 
  duration, 
  view_rating, 
  genre, 
  director
FROM movies;`;

export const insertMovie = `
  INSERT INTO movies (
    movie_title,
    description,
    image_url,
    duration,
    view_rating
  ) VALUES (
      ?,
      ?,
      ?,
      ?,
      ?,
      ?
  );`;

export const updateShowtimeWithMovie = `UPDATE showtimes SET movie_id = ? WHERE showtime_id = ?;`;

export const getShowtimesByTheater = `
SELECT s.showtime_id, 
  CONVERT_TZ(s.start_time, '+00:00', 'America/New_York') AS start_time, 
  CONVERT_TZ(s.end_time, '+00:00', 'America/New_York') AS end_time, 
  s.tickets_available, 
  m.movie_title, 
  m.image_url
FROM showtimes s
JOIN movies m ON s.movie_id = m.movie_id
WHERE s.theater_id = ?;
`;

export const getShowtimesByMovie = `
SELECT s.showtime_id, 
  CONVERT_TZ(s.start_time, '+00:00', 'America/New_York') AS start_time, 
  CONVERT_TZ(s.end_time, '+00:00', 'America/New_York') AS end_time, 
  s.tickets_available, 
  t.theater_name, 
  m.movie_title 
FROM showtimes s 
JOIN theaters t ON s.theater_id = t.theater_id 
JOIN movies m ON s.movie_id = m.movie_id 
WHERE s.movie_id = ?;
`;

export const getShowtimeById = `
SELECT s.showtime_id, 
  CONVERT_TZ(s.start_time, '+00:00', 'America/New_York') AS start_time, 
  CONVERT_TZ(s.end_time, '+00:00', 'America/New_York') AS end_time, 
  s.tickets_available, 
  m.movie_title, 
  m.image_url, 
  t.theater_name 
FROM showtimes s 
JOIN movies m ON s.movie_id = m.movie_id 
JOIN theaters t ON s.theater_id = t.theater_id 
WHERE s.showtime_id = ?;
`;

export const updateTicketsAvailable = `
UPDATE 
  showtimes 
SET tickets_available = ? 
WHERE showtime_id = ?;`;

export const getTheaters = `
SELECT 
  theater_id, theater_name, cinema_id, capacity, cleaned, 3D_Flag 
FROM theaters;`;

export const addShowtime = `
INSERT INTO showtimes 
  (start_time, end_time, tickets_available, theater_id, movie_id) 
VALUES 
  (?, ?, ?, ?, ?);`;

export const selectSeat = `
SELECT 
  seat_id 
FROM seats 
WHERE 
  seat_id = ? and theater_id = ?;`;

export const reserveSeat = `
UPDATE 
  seats 
SET seat_available = false 
WHERE seat_id = ? and theater_id = ?;`;

export const updateSeatCleanedStatus = `
UPDATE 
  seats 
SET cleaned = ? 
WHERE seat_id = ? and theater_id = ?;`;

export const employees = `
SELECT 
  employee_id, jobtitle, employee_fullname, emp_email, cinema_name
FROM employees
JOIN cinemas ON employees.cinema_id = cinemas.cinema_id`;

export const newEmployee = `
INSERT INTO employees 
  (employee_fullname, username, emp_password, emp_email, admin_flag, jobtitle, cinema_id) 
VALUES 
  (?, ?, ?, ?, ?, ?, ?);`;

export const login = `
SELECT EXISTS(
    SELECT 1
    FROM employees
    WHERE 
      username = ?
      AND emp_password = ?
) AS recordExists;
`;

export const cinemas = `
SELECT cinema_id, cinema_name FROM cinemas;`;

export const getSeatsByTheater = `
SELECT 
  seat_row, seat_column, seat_number, seat_available, cleaned
FROM seats
WHERE theater_id = ?;`;
