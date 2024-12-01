import mysql from 'mysql2/promise';

export async function dbMiddleware(req, res, next) {
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
