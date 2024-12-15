import express from 'express';
import {
  getAllMovies,
  insertMovie,
  updateShowtimeWithMovie,
  getShowtimesByTheater,
  getShowtimesByMovie,
  getShowtimeById,
  updateTicketsAvailable,
  getTheaters,
  addShowtime,
  reserveSeat,
  updateSeatCleanedStatus,
  employees,
  newEmployee,
  login,
  getMoviesByFilters,
  usernameExists,
  getSeatsByTheater,
  requestCleaning,
  getTheatersByCinema,
  selectSeat,
  getTicket,
  deleteEmployee,
} from '../sql/sql.js';
import { sortResults } from './helpers.js';
import { getReviewsByCinemaId } from '../sql/sql.js';

const router = express.Router();

router.get('/movies', async (req, res) => {
  const connection = req.db;
  try {
    const { sortOn, sortOrder } = req.query;
    const [movies] = await connection.query(
      sortResults(getAllMovies, sortOn, sortOrder)
    );
    return res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/create-movie', async (req, res) => {
  const connection = req.db;
  try {
    const { movie_title, description, image_url, duration, view_rating } =
      req.body;

    await connection.query(insertMovie, [
      movie_title,
      description,
      image_url,
      duration,
      view_rating,
    ]);
    return res.status(201).json({ message: 'Movie added successfully' });
  } catch (error) {
    console.error('Error adding movie:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/getTheatersByCinema', async (req, res) => {
  const connection = req.db;
  try {
    const { cinema_id } = req.query;
    const [theaters] = await connection.query(getTheatersByCinema, [cinema_id]);
    res.json(theaters);
  } catch (error) {
    console.error('Error fetching theaters by cinema:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/updateShowtimeWithMovie', async (req, res) => {
  const connection = req.db;
  try {
    console.log('Request Body:', req.body);
    const { showtimeId, movieId, startTime, endTime } = req.body;

    if (!movieId || !startTime || !endTime) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    await connection.query(
      `UPDATE showtimes SET movie_id = ?, start_time = ?, end_time = ? WHERE showtime_id = ?`,
      [movieId, startTime, endTime, showtimeId]
    );
    return res.status(200).json({ message: 'Showtime updated successfully' });
  } catch (error) {
    console.error('Error updating showtime:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/getShowtimesByTheater', async (req, res) => {
  const connection = req.db;
  try {
    const { theaterId, sortOn, sortOrder } = req.query;
    const [showtimes] = await connection.query(
      sortResults(getShowtimesByTheater, sortOn, sortOrder),
      [theaterId]
    );
    return res.json(showtimes);
  } catch (error) {
    console.error('Error fetching showtimes:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/getShowtimesByMovie', async (req, res) => {
  const connection = req.db;
  try {
    const { movieId, sortOn, sortOrder } = req.query;
    const [showtimes] = await connection.query(
      sortResults(getShowtimesByMovie, sortOn, sortOrder),
      [movieId]
    );
    return res.json(showtimes);
  } catch (error) {
    console.error('Error fetching showtimes:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/getShowtimeById', async (req, res) => {
  const connection = req.db;
  try {
    const { showtimeId } = req.query;
    const [showtime] = await connection.query(getShowtimeById, [showtimeId]);
    return res.json(showtime);
  } catch (error) {
    console.error('Error fetching showtime:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/updateTicketsAvailable', async (req, res) => {
  const connection = req.db;
  try {
    const { tickets_available, showtime_id } = req.body;
    await connection.query(updateTicketsAvailable, [
      tickets_available,
      showtime_id,
    ]);
    return res.status(201).json({ message: 'Tickets updated successfully' });
  } catch (error) {
    console.error('Error updating tickets:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/getTheaters', async (req, res) => {
  const connection = req.db;
  try {
    const [theaters] = await connection.query(getTheaters);
    return res.json(theaters);
  } catch (error) {
    console.error('Error fetching theaters:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/addShowtime', async (req, res) => {
  const connection = req.db;
  try {
    const { start_time, end_time, tickets_available, theater_id, movie_id } =
      req.body;
    await connection.query(addShowtime, [
      start_time,
      end_time,
      tickets_available,
      theater_id,
      movie_id,
    ]);
    return res.status(201).json({ message: 'Showtime added successfully' });
  } catch (error) {
    console.error('Error adding showtime:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/selectSeat', async (req, res) => {
  const connection = req.db;
  try {
    const { seat_id, theater_id } = req.query;
    const [seat] = await connection.query(selectSeat, [seat_id, theater_id]);
    return res.json(seat);
  } catch (error) {
    console.error('Error selecting ticket:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/reserveSeat', async (req, res) => {
  const connection = req.db;
  try {
    const {
      ticket_type,
      ticket_price,
      age_group,
      seat_id,
      theater_id,
      showtime_id,
    } = req.body;
    await connection.query(reserveSeat, [
      ticket_type,
      ticket_price,
      age_group,
      seat_id,
      theater_id,
      showtime_id,
    ]);
    return res.status(201).json({ message: 'Seat reserved successfully' });
  } catch (error) {
    console.error('Error reserving seat:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/updateSeatCleanedStatus', async (req, res) => {
  const connection = req.db;
  try {
    const { cleaned, seat_id, theater_id } = req.body;
    await connection.query(updateSeatCleanedStatus, [
      cleaned,
      seat_id,
      theater_id,
    ]);
    return res.status(201).json({ message: 'Seat cleaned status updated' });
  } catch (error) {
    console.error('Error updating seat status:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/employees', async (req, res) => {
  const connection = req.db;
  try {
    const [results] = await connection.query(employees);
    return res.json(results);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/employeesFilter', async (req, res) => {
  const connection = req.db;
  try {
    const [results] = await connection.query(
      employees +
        ` WHERE employee_fullname LIKE '%${req.query.employee_fullname}%'`
    );
    return res.json(results);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/newEmployee', async (req, res) => {
  const connection = req.db;
  try {
    const {
      employee_fullname,
      username,
      emp_password,
      emp_email,
      admin_flag,
      jobtitle,
      cinema_id,
    } = req.body;
    const [duplicateUsername] = await connection.query(usernameExists, [
      username,
    ]);
    if (duplicateUsername[0].recordExists > 0) {
      throw new Error('Username already exists');
    }
    await connection.query(newEmployee, [
      employee_fullname,
      username,
      emp_password,
      emp_email,
      admin_flag,
      jobtitle,
      cinema_id,
    ]);
    return res.status(201).json({ message: 'Employee added successfully' });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const connection = req.db;
  try {
    const { username, password } = req.body;
    const [result] = await connection.query(login, [username, password]);
    if (result && result.length > 0) {
      return res.json({ message: 'Login successful', data: result[0] });
    } else {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/cinemas', async (req, res) => {
  const connection = req.db;
  try {
    const [cinemas] = await connection.query(`
      SELECT cinema_id, cinema_name FROM cinemas;
    `);
    res.json(cinemas);
  } catch (error) {
    console.error('Error fetching cinemas:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/seatsByTheater', async (req, res) => {
  const connection = req.db;
  try {
    const [results] = await connection.query(getSeatsByTheater, [
      req.query.theater_id,
    ]);
    return res.json(results);
  } catch (error) {
    console.error('Error fetching seats:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/getMoviesByFilters', async (req, res) => {
  const connection = req.db;
  try {
    const { cinema_id, theater_id, date, time } = req.query;

    const [movies] = await connection.query(getMoviesByFilters, [
      cinema_id,
      theater_id,
      date,
      time,
    ]);
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies by filters:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/getTicket', async (req, res) => {
  const connection = req.db;
  try {
    const [ticket] = await connection.query(getTicket, [req.query.seat_id]);
    return res.json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/reviews', async (req, res) => {
  const connection = req.db;
  const { cinema_id } = req.query;

  if (!cinema_id) {
    return res.status(400).json({ error: 'Cinema ID is required' });
  }

  try {
    const [reviews] = await connection.query(getReviewsByCinemaId, [cinema_id]);
    res.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

router.post('/deleteEmployee', async (req, res) => {
  const connection = req.db;
  try {
    const { employee_id } = req.body;
    await connection.query(deleteEmployee, [employee_id]);
    return res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
