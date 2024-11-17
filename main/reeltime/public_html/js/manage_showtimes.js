document.addEventListener("DOMContentLoaded", () => {
    const movieDropdown = document.getElementById("movieSelector");
    const movieImage = document.getElementById("movieImage");
    const movieTitle = document.getElementById("movieTitle");
    const movieGenre = document.getElementById("movieGenre");
    const movieDuration = document.getElementById("movieDuration");
    const movieDirector = document.getElementById("movieDirector");
    const movieRating = document.getElementById("movieRating");
    const reviewLink = document.getElementById("reviewLink");
    const stars = document.getElementById("stars");
    const theaterShowtimes = document.getElementById("theaterShowtimes");
    const datePicker = document.getElementById("dateCardContainer");
    const placeholderMessage = document.getElementById("placeholderMessage");
    const movieDetailsSection = document.getElementById("movieDetails");
    const theaterShowtimesSection = document.getElementById("theaterShowtimes");
    const monthDisplay = document.getElementById("monthDisplay");

    let showtimeData = [];
    let currentDate = null;

    // Display placeholder message initially
    placeholderMessage.textContent = "Pick a movie to manage showtimes.";

    // Fetch movie data from the backend
    fetch("/getMovies")
        .then((response) => {
            if (!response.ok) throw new Error("Failed to fetch movies");
            return response.json();
        })
        .then((data) => {
            if (data.movies) {
                placeholderMessage.textContent = ""; // Clear placeholder message
                populateDropdown(data.movies);
            } else {
                throw new Error("No movies found in the response");
            }
        })
        .catch((err) => {
            console.error("Error fetching movies:", err);
            placeholderMessage.textContent = "Failed to load movies.";
            placeholderMessage.style.color = "#F5C451";
        });

    // Populate the dropdown with movies
    function populateDropdown(movies) {
        movieDropdown.innerHTML = ""; // Clear existing options

        // Create placeholder option
        const placeholder = document.createElement("option");
        placeholder.textContent = "Choose a Movie";
        placeholder.disabled = true;
        placeholder.selected = true;
        movieDropdown.appendChild(placeholder);

        // Add movie options
        movies.forEach((movie) => {
            const option = document.createElement("option");
            option.value = movie.movie_id;
            option.textContent = movie.movie_title;
            movieDropdown.appendChild(option);
        });

        movieDropdown.disabled = false;

        // Add event listener for dropdown changes
        movieDropdown.addEventListener("change", function () {
            const selectedMovieId = parseInt(this.value, 10);
            const selectedMovie = movies.find((movie) => movie.movie_id === selectedMovieId);
            if (selectedMovie) {
                placeholderMessage.textContent = ""; // Clear any placeholder message
                updateMovieDetails(selectedMovie);
                fetchShowtimesByMovie(selectedMovieId);
            }
        });
    }

    // Update movie details when a movie is selected
    function updateMovieDetails(movie) {
        movieDetailsSection.style.display = "flex";

        movieImage.src = movie.image_url || "images/placeholder.jpg";
        movieImage.alt = movie.movie_title;
        movieTitle.textContent = movie.movie_title || "N/A";
        movieGenre.textContent = movie.genre || "N/A";
        movieDuration.textContent = movie.duration
            ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m`
            : "N/A";
        movieDirector.textContent = movie.director || "N/A";
        movieRating.textContent = movie.view_rating || "N/A";
        stars.innerHTML = generateStars(movie.avg_rating || 0);
        reviewLink.href = movie.review_link || "#";
        reviewLink.textContent = movie.review_link ? "Read Reviews" : "No Reviews";
    }

    // Fetch showtimes by movie ID and update the theater cards and date picker
    function fetchShowtimesByMovie(movieId) {
        theaterShowtimes.innerHTML = "<p>Loading showtimes...</p>";

        fetch(`/api/getShowtimesByMovie?movieId=${movieId}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.showtimes && data.showtimes.length > 0) {
                    showtimeData = data.showtimes; // Store showtime data for filtering
                    const startDate = new Date(showtimeData[0].start_time);
                    const endDate = new Date(showtimeData[showtimeData.length - 1].end_time);
                    currentDate = startDate; // Default to the first available date
                    createDatePicker(startDate, endDate); // Update date picker
                    updateTheaterShowtimesByDate(startDate);
                } else {
                    theaterShowtimes.innerHTML = "<p>No showtimes available for this movie.</p>";
                    datePicker.innerHTML = "";
                }
            })
            .catch((err) => {
                console.error("Error fetching showtimes:", err);
                theaterShowtimes.innerHTML = "<p>Failed to load showtimes.</p>";
            });
    }

    // Create date picker layout to reflect the full week between start and end dates
    function createDatePicker(startDate, endDate) {
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let current = new Date(startDate);

        datePicker.innerHTML = "";
        monthDisplay.textContent = current.toLocaleString("en-US", { month: "long", year: "numeric" }); // Update month display

        while (current <= endDate) {
            const date = new Date(current);
            const dateCard = document.createElement("div");
            dateCard.classList.add("date-card");

            dateCard.innerHTML = `
                <span>${date.getDate()}</span>
                <span>${daysOfWeek[date.getDay()]}</span>
            `;

            dateCard.addEventListener("click", () => {
                currentDate = date;
                updateDateSelection(dateCard);
                updateTheaterShowtimesByDate(date);
            });

            datePicker.appendChild(dateCard);
            current.setDate(current.getDate() + 1);
        }
    }

    // Update showtimes filtered by the selected date
    function updateTheaterShowtimesByDate(selectedDate) {
        const filteredShowtimes = showtimeData.filter(
            (showtime) =>
                new Date(showtime.start_time).toDateString() === selectedDate.toDateString()
        );

        theaterShowtimes.innerHTML = "";

        if (filteredShowtimes.length === 0) {
            theaterShowtimes.innerHTML = "<p>No showtimes available for this date.</p>";
            return;
        }

        filteredShowtimes.forEach((showtime) => {
            const showtimeCard = document.createElement("div");
            showtimeCard.classList.add("theater-card");

            showtimeCard.innerHTML = `
                <h3>${showtime.theater_name}</h3>
                <p>Start: ${new Date(showtime.start_time).toLocaleString()}</p>
                <p>End: ${new Date(showtime.end_time).toLocaleString()}</p>
                <p><strong>${showtime.tickets_available} Tickets Available</strong></p>
                <button class="modify-btn" data-showtime-id="${showtime.showtime_id}">Modify Showtime</button>
            `;

            showtimeCard.querySelector(".modify-btn").addEventListener("click", () => {
                modifyShowing(showtime.showtime_id);
            });

            theaterShowtimes.appendChild(showtimeCard);
        });
    }

    // Modify showtime functionality
    function modifyShowing(showtimeId) {
        alert(`Modify showtime with ID: ${showtimeId}`);
    }

    // Update date selection
    function updateDateSelection(selectedCard) {
        document.querySelectorAll(".date-card").forEach((card) => {
            card.classList.remove("selected");
        });
        selectedCard.classList.add("selected");
    }

    // Generate star ratings
    function generateStars(avgRating) {
        const fullStars = Math.floor(avgRating);
        const halfStar = avgRating % 1 >= 0.5 ? "★" : "";
        const emptyStars = "☆".repeat(5 - fullStars - (halfStar ? 1 : 0));
        return "★".repeat(fullStars) + halfStar + emptyStars;
    }
});
