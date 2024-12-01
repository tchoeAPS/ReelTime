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
    const monthDisplay = document.getElementById("monthDisplay");

    // Modal variables
    const modal = document.getElementById("modifyShowtimeModal");
    const closeModalBtn = document.querySelector(".close-btn");
    const modifyShowtimeForm = document.getElementById("modifyShowtimeForm");
    const newStartTimeInput = document.getElementById("flatpickrStartTime");
    const newEndTimeInput = document.getElementById("flatpickrEndTime");
    let currentShowtimeId = null;

    // Initialize Flatpickr
    flatpickr("#flatpickrStartTime", { enableTime: true, dateFormat: "Y-m-d H:i" });
    flatpickr("#flatpickrEndTime", { enableTime: true, dateFormat: "Y-m-d H:i" });

    let showtimeData = [];
    let currentDate = null;

    // Fetch movie data
    fetch("http://localhost:3000/api/movies")
        .then((response) => {
            if (!response.ok) throw new Error("Failed to fetch movies");
            return response.json();
        })
        .then((data) => {
            if (data.length > 0) {
                placeholderMessage.textContent = "";
                populateDropdown(data);
            } else {
                throw new Error("No movies found in the response");
            }
        })
        .catch((err) => {
            console.error("Error fetching movies:", err);
            placeholderMessage.textContent = "Failed to load movies.";
            placeholderMessage.style.color = "#F5C451";
        });

    function populateDropdown(movies) {
        movieDropdown.innerHTML = "";

        const placeholder = document.createElement("option");
        placeholder.textContent = "Choose a Movie";
        placeholder.disabled = true;
        placeholder.selected = true;
        movieDropdown.appendChild(placeholder);

        movies.forEach((movie) => {
            const option = document.createElement("option");
            option.value = movie.movie_id;
            option.textContent = movie.movie_title;
            movieDropdown.appendChild(option);
        });

        movieDropdown.disabled = false;

        movieDropdown.addEventListener("change", function () {
            const selectedMovieId = parseInt(this.value, 10);
            const selectedMovie = movies.find((movie) => movie.movie_id === selectedMovieId);
            if (selectedMovie) {
                placeholderMessage.textContent = "";
                updateMovieDetails(selectedMovie);
                fetchShowtimesByMovie(selectedMovieId);
            }
        });
    }

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

    function fetchShowtimesByMovie(movieId) {
        fetch(`/api/getShowtimesByMovie?movieId=${movieId}`)
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch showtimes");
                return response.json();
            })
            .then((data) => {
                const showtimes = Array.isArray(data) ? data : data.showtimes || [];
                showtimeData = showtimes; // Store showtime data globally
    
                console.log("Fetched Showtimes:", showtimeData);
    
                // Define the year start and end
                const yearStart = new Date(2024, 0, 1); 
                const yearEnd = new Date(2024, 11, 31); 
    
                // Create the date picker for the entire year
                createDatePicker(yearStart, yearEnd);
    
                if (currentDate) {
                    updateTheaterShowtimesByDate(currentDate);
                } else {
                    placeholderMessage.textContent = "Select a date to view showtimes.";
                }
            })
            .catch((err) => {
                console.error("Error fetching showtimes:", err);
                theaterShowtimes.innerHTML = "<p>Failed to load showtimes.</p>";
            });
    }
    

    function createDatePicker(yearStart, yearEnd) {
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        datePicker.innerHTML = "";
    
        const startYear = yearStart.getFullYear();
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December",
        ];
    
        const today = new Date();
        let selectedMonthIndex = today.getFullYear() === startYear ? today.getMonth() : 0;
    
        let existingDropdown = document.getElementById("monthDropdown");
        if (!existingDropdown) {
            const monthDropdown = document.createElement("select");
            monthDropdown.id = "monthDropdown";
            months.forEach((month, index) => {
                const option = document.createElement("option");
                option.value = index;
                option.textContent = month;
                if (index === selectedMonthIndex) {
                    option.selected = true;
                }
                monthDropdown.appendChild(option);
            });
    
            const monthSelectorContainer = document.createElement("div");
            monthSelectorContainer.style.textAlign = "center";
            monthSelectorContainer.style.marginBottom = "10px";
            monthSelectorContainer.appendChild(monthDropdown);
            datePicker.parentElement.insertBefore(monthSelectorContainer, datePicker);
    
            monthDropdown.addEventListener("change", (event) => {
                selectedMonthIndex = parseInt(event.target.value, 10);
                renderMonth(selectedMonthIndex);
            });
        }
    
        function renderMonth(monthIndex) {
            datePicker.innerHTML = "";
            const start = new Date(startYear, monthIndex, 1);
            const end = new Date(startYear, monthIndex + 1, 0);
    
            let current = new Date(start);
            let hasAnyDates = false;
    
            while (current <= end) {
                const date = new Date(current);
                const dateCard = document.createElement("div");
                dateCard.classList.add("date-card");
    
                const hasShowtime = showtimeData.some(
                    (showtime) => new Date(showtime.start_time).toDateString() === date.toDateString()
                );
                if (hasShowtime) {
                    dateCard.classList.add("highlight");
                    hasAnyDates = true;
                }
    
                if (currentDate && current.toDateString() === currentDate.toDateString()) {
                    dateCard.classList.add("selected");
                }
    
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
    
            if (!hasAnyDates) {
                datePicker.innerHTML = "<p>No dates available for this month.</p>";
            }
        }
    
        renderMonth(selectedMonthIndex);
    }
    

    function updateTheaterShowtimesByDate(selectedDate) {
        console.log("Updating Showtimes for Date:", selectedDate);

        const filteredShowtimes = showtimeData.filter(
            (showtime) =>
                new Date(showtime.start_time).toDateString() === selectedDate.toDateString()
        );
        console.log("Filtered Showtimes:", filteredShowtimes);

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
                openModal(showtime.showtime_id);
            });

            theaterShowtimes.appendChild(showtimeCard);
        });
    }

    // Modal functions
    function openModal(showtimeId) {
        currentShowtimeId = showtimeId;
        modal.style.display = "block";
    }

    closeModalBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    modifyShowtimeForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const newStartTime = newStartTimeInput.value;
        const newEndTime = newEndTimeInput.value;

        fetch("/api/updateShowtime", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                showtimeId: currentShowtimeId,
                startTime: newStartTime,
                endTime: newEndTime,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    alert("Showtime updated successfully!");
                    modal.style.display = "none";
                    const selectedMovieId = parseInt(movieDropdown.value, 10);
                    fetchShowtimesByMovie(selectedMovieId);
                } else {
                    throw new Error("Failed to update showtime");
                }
            })
            .catch((error) => {
                console.error("Error updating showtime:", error);
                alert("An error occurred while updating the showtime.");
            });
    });

    function updateDateSelection(selectedCard) {
        document.querySelectorAll(".date-card").forEach((card) => {
            card.classList.remove("selected");
        });
        selectedCard.classList.add("selected");
    }

    function generateStars(avgRating) {
        const fullStars = Math.floor(avgRating);
        const halfStar = avgRating % 1 >= 0.5 ? "★" : "";
        const emptyStars = "☆".repeat(5 - fullStars - (halfStar ? 1 : 0));
        return "★".repeat(fullStars) + halfStar + emptyStars;
    }
});
