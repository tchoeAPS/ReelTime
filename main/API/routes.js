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
} from '../sql/sql.js';
import { sortResults } from './helpers.js';

const router = express.Router();

// example of GET API
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

// example of POST API
router.post('/create-movie', async (req, res) => {
  const connection = req.db;
  try {
    const { movie_title, description, image_url, duration, view_rating } =
      req.body;

    // Insert the movie into the database
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

router.post('/updateShowtimeWithMovie', async (req, res) => {
  const connection = req.db;
  try {
    const { showtimeId, movieId } = req.body;
    await connection.query(updateShowtimeWithMovie, [movieId, showtimeId]);
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
    return res.json(showtime); // Respond with the showtime details
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
    const [seat] = await connection.query(updateTicketsAvailable, [
      seat_id,
      theater_id,
    ]);
    return res.json(seat);
  } catch (error) {
    console.error('Error selecting ticket:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/reserveSeat', async (req, res) => {
  const connection = req.db;
  try {
    const { seat_id, theater_id } = req.body;
    await connection.query(reserveSeat, [seat_id, theater_id]);
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
    const [employees] = await connection.query(employees);
    return res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/newEmployee', async (req, res) => {
  const connection = req.db;
  try {
    const {
      username,
      emp_password,
      emp_email,
      created_at,
      admin_flag,
      job_title,
      cinema_id,
    } = req.body;
    await connection.query(newEmployee, [
      username,
      emp_password,
      emp_email,
      created_at,
      admin_flag,
      job_title,
      cinema_id,
    ]);
    return res.status(201).json({ message: 'Employee added successfully' });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
