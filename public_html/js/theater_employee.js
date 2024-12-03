document.addEventListener('DOMContentLoaded', () => {
  const reserveBtn = document.getElementById('reserveBtn');
  const modal = document.getElementById('reservationModal');
  const seatingChart = document.getElementById('seatingChart');
  const theaterDropdown = document.getElementById('theaterDropdown');
  const selectedSeatDetails = document.getElementById('selectedSeatDetails');

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
      const row = seat.seat_column;
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
    generateSeats();
  });

  // Fetch and populate theaters when the page loads
  fetchTheaters();
});
