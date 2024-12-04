document.addEventListener('DOMContentLoaded', () => {
  const reserveBtn = document.getElementById('reserveBtn');
  const modal = document.getElementById('reservationModal');
  const seatingChart = document.getElementById('seatingChart');
  const theaterDropdown = document.getElementById('theaterDropdown');
  const showtimeDropdown = document.getElementById('showtimeDropdown');
  const selectedSeatDetails = document.getElementById('selectedSeatDetails');
  const cleanBtn = document.getElementById('cleanBtn');
  const ageGroupDropdown = document.getElementById('ageGroup');
  const ticketPriceInput = document.getElementById('ticketPrice');

  let selectedSeatHtml = null;
  let selectedSeatData = null;

  const ticketPrices = {
    child: 10.0,
    regular: 15.0,
    senior: 12.0,
  };

  const ageGroupValues = {
    child: '0-12',
    regular: '13-64',
    senior: '65+',
  };

  ageGroupDropdown.addEventListener('change', () => {
    const selectedAgeGroup = ageGroupDropdown.value;
    const price = ticketPrices[selectedAgeGroup];
    if (price !== undefined) {
      ticketPriceInput.value = `$${price.toFixed(2)}`;
    } else {
      ticketPriceInput.value = '';
    }
  });

  // Fetch theaters from the API and populate the dropdown
  const fetchTheaters = async () => {
    const cinemaId = localStorage.getItem('employeeCinemaId');
    const apiEndpoint = `http://localhost:3000/api/getTheatersByCinema?cinema_id=${cinemaId}`;
    try {
      const response = await fetch(apiEndpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch theaters');
      }
      const theaters = await response.json();
      await populateDropdown(theaters);
    } catch (error) {
      console.error('Error fetching theaters:', error);
      alert('Failed to load theaters. Please try again.');
    }
  };

  const populateDropdown = async (theaters) => {
    theaterDropdown.innerHTML = '';
    theaters.forEach((theater) => {
      const option = document.createElement('option');
      option.value = theater.theater_id;
      option.textContent = theater.theater_name;
      theaterDropdown.appendChild(option);
    });
    // Fetch seats for the first theater by default
    await fetchShowtimes(theaters[0].theater_id);
  };

  const fetchShowtimes = async (theaterId) => {
    const apiEndpoint = `http://localhost:3000/api/getShowtimesByTheater?theaterId=${theaterId}?sortOn=start_time&sortOrder=ASC`;
    try {
      const response = await fetch(apiEndpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch showtimes');
      }
      const showtimes = await response.json();
      await populateShowtimeDropdown(showtimes);
    } catch {
      console.error('Error fetching showtimes:', error);
      alert('Failed to load showtimes. Please try again.');
    }
  };

  const populateShowtimeDropdown = async (showtimes) => {
    showtimeDropdown.innerHTML = '';
    showtimes.forEach((showtime) => {
      const option = document.createElement('option');
      option.value = showtime.showtime_id;
      option.textContent = `${showtime.movie_title} | ${showtime.start_time}`;
      showtimeDropdown.appendChild(option);
    });
    await fetchSeats(showtimes[0].theater_id);
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

  const fetchTicket = async (ticketId) => {
    const apiEndpoint = `http://localhost:3000/api/getTicket?seat_id=${ticketId}`;
    try {
      const response = await fetch(apiEndpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch ticket');
      }
      const ticket = await response.json();
      return ticket[0];
    } catch (error) {
      console.error('Error fetching ticket:', error);
      alert('Failed to load ticket. Please try again.');
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
        seat.className = seatData.seat_available
          ? 'seat available'
          : 'seat reserved';
        seat.innerText = seatData.seat_number;

        // Handle seat selection
        seat.addEventListener('click', async () => {
          if (seat.classList.contains('reserved')) {
            const ticket = await fetchTicket(seatData.seat_id);
            alert(
              'This seat is reserved.\n' +
                'Ticket ID: ' +
                ticket.ticket_id +
                '\n' +
                'Ticket Type: ' +
                ticket.ticket_type +
                '\n' +
                'Ticket Price: ' +
                ticket.ticket_price +
                '\n' +
                'Ticket Age Group: ' +
                ticket.age_group +
                '\n'
            );
            return;
          }

          // Deselect previous seat
          if (selectedSeatHtml) {
            selectedSeatHtml.classList.remove('selected');
          }

          // Select new seat
          seat.classList.add('selected');
          selectedSeatHtml = seat;
          selectedSeatData = seatData;
          updateButtonText();
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
    if (!selectedSeatHtml) {
      alert('Please select a seat first!');
      return;
    }
    modal.style.display = 'block';
  });

  theaterDropdown.addEventListener('change', async () => {
    const theaterId = theaterDropdown.value;
    if (theaterId) {
      await fetchShowtimes(theaterId);
    }
  });

  showtimeDropdown.addEventListener('change', async () => {
    const showtimeId = showtimeDropdown.value;
    if (showtimeId) {
      await fetchSeats(showtimeId);
    }
  });

  reserveBtn.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  document.querySelector('.cancel-btn').addEventListener('click', () => {
    ageGroupDropdown.value = '';
    ticketPriceInput.value = '';
    modal.style.display = 'none';
  });

  const saveBtn = document.querySelector('.save-btn');

  saveBtn.addEventListener('click', async () => {
    if (!selectedSeatHtml) {
      alert('No seat selected. Please select a seat before saving.');
      return;
    }
    if (!ageGroupDropdown.value) {
      alert('Please select an age group.');
      return;
    }

    try {
      // Send a request to reserve the seat
      const apiEndpoint = 'http://localhost:3000/api/reserveSeat';
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_type: ageGroupDropdown.value,
          theater_id: theaterDropdown.value,
          seat_id: selectedSeatData.seat_id,
          ticket_price: ticketPrices[ageGroupDropdown.value],
          showtime_id: showtimeDropdown.value,
          age_group: ageGroupValues[ageGroupDropdown.value],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reserve the seat.');
      }

      selectedSeatHtml.classList.remove('available');
      selectedSeatHtml.classList.add('reserved');
      alert('Seat reserved successfully!');

      modal.style.display = 'none';
    } catch (error) {
      console.error('Error reserving seat:', error);
      alert('Failed to reserve the seat. Please try again.');
    }
  });

  const updateButtonText = () => {
    cleanBtn.textContent = selectedSeatData.cleaned
      ? 'Mark as Needs Cleaning'
      : 'Mark as Cleaned';
  };

  cleanBtn.addEventListener('click', async () => {
    const apiEndpoint = 'http://localhost:3000/api/updateSeatCleanedStatus';
    const cleaned = selectedSeatData.cleaned === 1 ? 0 : 1;
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cleaned: cleaned,
          seat_id: selectedSeatData.seat_id,
          theater_id: selectedSeatData.theater_id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update seat status.');
      }
      selectedSeatData.cleaned = cleaned;
      selectedSeatDetails.innerText = `Seat: ${selectedSeatData.seat_number} | Status: ${
        selectedSeatData.seat_available ? 'Available' : 'Reserved'
      } | Cleaned: ${selectedSeatData.cleaned ? 'Yes' : 'No'}`;
      alert('Seat status updated successfully!');
    } catch (error) {
      console.error('Error updating seat status:', error);
      alert('Failed to update seat status. Please try again.');
    }
    updateButtonText();
  });

  fetchTheaters();
});
