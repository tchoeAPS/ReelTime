document.addEventListener('DOMContentLoaded', () => {
    const reserveBtn = document.getElementById('reserveBtn');
    const modal = document.getElementById('reservationModal');
    const seatingChart = document.getElementById('seatingChart');
    const theaterDropdown = document.getElementById('theaterDropdown');
    const selectedSeatDetails = document.getElementById('selectedSeatDetails');
    const cinemaDropdown = document.getElementById('cinemaDropdown');
    const modalTheaterDropdown = document.getElementById('modalTheaterDropdown');
    const dateInput = document.getElementById('dateInput');
    const timeInput = document.getElementById('timeInput');
    const movieDropdown = document.getElementById('movieDropdown');
  
    let selectedSeat = null;
  
    // Fetch theaters from the API and populate the dropdown
    const fetchTheaters = async () => {
      const apiEndpoint = 'http://localhost:3000/api/getTheaters';
      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch theaters');
        }
        const theaters = await response.json();
        populateDropdown(theaters);
      } catch (error) {
        console.error('Error fetching theaters:', error);
        alert('Failed to load theaters. Please try again.');
      }
    };
  
    const populateDropdown = (theaters) => {
      theaterDropdown.innerHTML = '';
      theaters.forEach((theater) => {
        const option = document.createElement('option');
        option.value = theater.theater_id;
        option.textContent = theater.theater_name;
        theaterDropdown.appendChild(option);
      });
      // Fetch seats for the first theater by default
      fetchSeats(theaters[0].theater_id);
    };
  
    const fetchSeats = async (theaterId) => {
      const apiEndpoint = `http://localhost:3000/api/seatsByTheater?theater_id=${theaterId}`;
      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch seats');
        }
        const seats = await response.json();
        generateSeats(seats);
      } catch (error) {
        console.error('Error fetching seats:', error);
        alert('Failed to load seats. Please try again.');
      }
    };
  
    const generateSeats = (seats) => {
      seatingChart.innerHTML = ''; // Clear previous seating chart
  
      // Group seats by rows
      const rows = {};
      seats.forEach((seat) => {
        const row = seat.seat_row; // Assuming seat row is defined
        if (!rows[row]) {
          rows[row] = [];
        }
        rows[row].push(seat);
      });
  
      Object.keys(rows).forEach((rowLabel) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'seat-row';
  
        rows[rowLabel].forEach((seatData) => {
          const seat = document.createElement('div');
          seat.className = seatData.seat_available ? 'seat available' : 'seat reserved';
          seat.innerText = seatData.seat_number;
  
          // Handle seat selection
          seat.addEventListener('click', () => {
            if (seat.classList.contains('reserved')) {
              alert('This seat is reserved.');
              return;
            }
  
            // Deselect previous seat
            if (selectedSeat) {
              selectedSeat.classList.remove('selected');
            }
  
            // Select new seat
            seat.classList.add('selected');
            selectedSeat = seat;
  
            // Update seat details
            selectedSeatDetails.innerText = `Seat: ${seat.innerText} | Status: ${
              seatData.seat_available ? 'Available' : 'Reserved'
            } | Cleaned: ${seatData.cleaned ? 'Yes' : 'No'}`;
          });
  
          rowDiv.appendChild(seat);
        });
  
        seatingChart.appendChild(rowDiv); // Append the row to the seating chart
      });
    };
  
    reserveBtn.addEventListener('click', () => {
      if (!selectedSeat) {
        alert('Please select a seat first!');
        return;
      }
      modal.style.display = 'block';
    });
  
    theaterDropdown.addEventListener('change', () => {
      const theaterId = theaterDropdown.value;
      if (theaterId) {
        fetchSeats(theaterId);
      }
    });
  
    const openReservationModal = async () => {
      modal.style.display = 'block';
    
      // Ensure the modal dropdown reflects the current selection
      const selectedTheaterId = theaterDropdown.value;
    
      // Populate theaters in the modal dropdown
      try {
        const apiEndpoint = 'http://localhost:3000/api/getTheaters';
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch theaters');
        }
        const theaters = await response.json();
        populateModalTheaterDropdown(theaters, selectedTheaterId);
      } catch (error) {
        console.error('Error fetching theaters:', error);
        alert('Failed to load theaters. Please try again.');
      }
      
      fetchCinemas();
      fetchMoviesByFilters();
    };
    
    // Populate the modal theater dropdown
    const populateModalTheaterDropdown = (theaters, selectedTheaterId) => {
      modalTheaterDropdown.innerHTML = '<option value="">Select Theater</option>'; 
      theaters.forEach((theater) => {
        const option = document.createElement('option');
        option.value = theater.theater_id;
        option.textContent = theater.theater_name;
        modalTheaterDropdown.appendChild(option);
      });
      
      modalTheaterDropdown.value = selectedTheaterId;
    };
    
    reserveBtn.addEventListener('click', () => {
      openReservationModal();
    
      // Attach listeners for fetching movies dynamically
      cinemaDropdown.addEventListener('change', fetchMoviesByFilters);
      modalTheaterDropdown.addEventListener('change', fetchMoviesByFilters);
      dateInput.addEventListener('change', fetchMoviesByFilters);
      timeInput.addEventListener('change', fetchMoviesByFilters);
    });
    
  
    const fetchCinemas = async () => {
      const apiEndpoint = 'http://localhost:3000/api/cinemas';
      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch cinemas');
        }
        const cinemas = await response.json();
        populateCinemaDropdown(cinemas);
      } catch (error) {
        console.error('Error fetching cinemas:', error);
        alert('Failed to load cinemas. Please try again.');
      }
    };
  
    const fetchMoviesByFilters = async () => {
      const cinemaId = cinemaDropdown.value;
      const theaterId = modalTheaterDropdown.value;
      const date = dateInput.value;
      const time = timeInput.value;
    
      if (!cinemaId || !theaterId || !date || !time) {
        return;
      }
    
      const apiEndpoint = `http://localhost:3000/api/getMoviesByFilters?cinema_id=${cinemaId}&theater_id=${theaterId}&date=${date}&time=${time}`;
      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        const movies = await response.json();
        populateMovieDropdown(movies);
      } catch (error) {
        console.error('Error fetching movies:', error);
        alert('Failed to load movies. Please try again.');
      }
    };
    
    const populateMovieDropdown = (movies) => {
      movieDropdown.innerHTML = '';
      if (movies.length === 0) {
        alert('No movies available for the selected criteria.');
        return;
      }
      movies.forEach((movie) => {
        const option = document.createElement('option');
        option.value = movie.movie_id;
        option.textContent = movie.movie_title;
        movieDropdown.appendChild(option);
      });
    };
    
    
    
    const populateCinemaDropdown = (cinemas) => {
      cinemaDropdown.innerHTML = '<option value="">Select Cinema</option>'; 
      cinemas.forEach((cinema) => {
        const option = document.createElement('option');
        option.value = cinema.cinema_id;
        option.textContent = cinema.cinema_name;
        cinemaDropdown.appendChild(option);
      });
    };
    
    
    document.querySelector('.cancel-btn').addEventListener('click', () => {
      cinemaDropdown.value = '';
      modalTheaterDropdown.value = '';
      dateInput.value = '';
      timeInput.value = '';
      movieDropdown.innerHTML = '';
      modal.style.display = 'none';
    });
  
    const saveBtn = document.querySelector('.save-btn'); 
  
  saveBtn.addEventListener('click', async () => {
    if (!selectedSeat) {
      alert('No seat selected. Please select a seat before saving.');
      return;
    }
  
    const seatNumber = selectedSeat.innerText; // Get the selected seat's number
    const theaterId = modalTheaterDropdown.value;
  
    try {
      // Send a request to reserve the seat
      const apiEndpoint = 'http://localhost:3000/api/reserveSeat'; 
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seatNumber, theaterId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to reserve the seat.');
      }
  
      
      selectedSeat.classList.remove('available');
      selectedSeat.classList.add('reserved');
      alert('Seat reserved successfully!');
      
    
      modal.style.display = 'none';
    } catch (error) {
      console.error('Error reserving seat:', error);
      alert('Failed to reserve the seat. Please try again.');
    }
  });
  
  
    fetchTheaters();
  });
  
  
  