import { sortResults } from './helpers.js';

export function getAllMovies(sortOn, sortOrder) {
  const sql = `SELECT * FROM movies`;
  if (sortOn && sortOrder) {
    return sql + sortResults(sortOn, sortOrder);
  }
  return sql;
}

export const getMoviesCount = `SELECT COUNT(*) as count FROM movies`;

export const insertMovie = `
  INSERT INTO movies (
    movie_id,
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
  )`;
