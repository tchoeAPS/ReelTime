document.addEventListener('DOMContentLoaded', () => {
  // Function to fetch movies from the API
  async function fetchMovies() {
    try {
      const response = await fetch('http://localhost:3000/api/movies');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const movies = await response.json();
      displayMovies(movies);
    } catch (error) {
      console.error('Error fetching movies:', error);
      displayErrorMessage();
    }
  }

  function displayMovies(movies) {
    const movieGrid = document.getElementById('movieGrid');

    // Clear any existing content
    movieGrid.innerHTML = '';

    movies.forEach((movie) => {
      // Create the movie item container
      const movieItem = document.createElement('div');
      movieItem.classList.add('movie-item');

      // Create the image element
      const img = document.createElement('img');
      img.src = movie.image_url;
      img.alt = movie.movie_title;

      // Create the title element
      const title = document.createElement('h2');
      title.textContent = movie.movie_title;

      // Create the description element
      const description = document.createElement('p');
      description.textContent = `${movie.genre} | ${movie.view_rating}`;

      // Append elements to the movie item
      movieItem.appendChild(img);
      movieItem.appendChild(title);
      movieItem.appendChild(description);

      // Append the movie item to the grid
      movieGrid.appendChild(movieItem);
    });
  }

  // Function to display an error message
  function displayErrorMessage() {
    const movieGrid = document.getElementById('movieGrid');
    movieGrid.innerHTML =
      '<p>Failed to load movies. Please try again later.</p>';
  }

  fetchMovies();
});
