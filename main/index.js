import express from 'express';
import mysql from 'mysql2/promise';
import { getAllMovies, getMoviesCount, insertMovie } from './sql.js';

const app = express();
const PORT = 3000;

async function dbMiddleware(req, res, next) {
  try {
    req.db = await mysql.createConnection({
      host: 'localhost',
      user: 'reeltime',
      password: 'reeltimeCSC540',
      database: 'reeltime',
    });
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection error' });
  }
}

app.use(express.json());
app.use(dbMiddleware);

async function startServer() {
  // example of GET API
  app.get('/api/movies', async (req, res) => {
    const connection = req.db;
    try {
      const { sortOn, sortOrder } = req.query;
      const [movies] = await connection.query(getAllMovies(sortOn, sortOrder));
      return res.json(movies);
    } catch (error) {
      console.error('Error fetching movies:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // example of POST API
  app.post('/api/create-movie', async (req, res) => {
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

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Error starting server:', error);
});
