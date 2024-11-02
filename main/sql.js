export const getAllMovies = `SELECT * FROM movies`;

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
