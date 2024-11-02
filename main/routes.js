import express from 'express';
import { getAllMovies, getMoviesCount, insertMovie } from './sql.js';
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

    const [movie_id] = await connection.query(getMoviesCount);
    // Insert the movie into the database
    await connection.query(insertMovie, [
      movie_id[0].count + 1,
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

export default router;
