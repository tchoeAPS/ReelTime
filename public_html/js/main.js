// Client for movie showtime scheduling system and management system

// Load available showtimes when the page loads
sendLoadTimesRequest();
let availableTimes = [];

// Event handler for the "Schedule Showtime" button
document.getElementById('bookShowtime').addEventListener('click', function () {
  const userName = document.getElementById('userName').value.trim();
  const showtimeId = document.getElementById('showtimeId').value.trim();
  const tickets = document.getElementById('tickets').value.trim();

  // Validate inputs
  if (!userName || !showtimeId || !tickets) {
    alert(
      'Please provide your name, select a showtime, and specify the number of tickets.'
    );
    return;
  }

  // Construct the query string with showtime ID, tickets, and user name
  const queryString = queryObjectToString({
    showtimeId: showtimeId,
    tickets: tickets,
    userName: userName,
  });

  // Create and send an AJAX request to schedule the showtime
  let AJAX = new XMLHttpRequest();
  AJAX.onerror = function () {
    alert('Network error while trying to schedule the showtime.');
  };
  AJAX.onload = function () {
    if (this.status === 200) {
      const responseObj = JSON.parse(this.responseText);

      if (responseObj.scheduled) {
        alert('Your movie has been successfully scheduled.');

        // Clear the form inputs
        clearForm();

        // Remove the scheduled showtime from the available times
        availableTimes = availableTimes.filter(
          (slot) => slot.showtime_id !== parseInt(showtimeId, 10)
        );

        // Update the table with the remaining available showtimes
        updateTimes(availableTimes);
      } else {
        alert(responseObj.message || 'Unable to schedule the showtime.');
      }
    } else {
      alert('Error scheduling the showtime.');
      console.error(`Status: ${this.status}, Response: ${this.responseText}`);
    }
  };

  // Set up and send the AJAX request
  AJAX.open('GET', `/schedule?${queryString}`);
  AJAX.send();
});

// Function to load available showtimes from the server
function sendLoadTimesRequest() {
  let AJAX = new XMLHttpRequest();
  AJAX.onerror = function () {
    alert('Network error while loading available showtimes.');
  };
  AJAX.onload = function () {
    if (this.status === 200) {
      const responseObj = JSON.parse(this.responseText);
      availableTimes = responseObj.available;
      updateTimes(availableTimes);
    } else {
      alert('Error loading available showtimes.');
      console.error(`Status: ${this.status}, Response: ${this.responseText}`);
    }
  };

  // Send AJAX request to load available showtimes
  AJAX.open('GET', '/load');
  AJAX.send();
}

// Function to update the available showtimes table in the HTML
function updateTimes(timesArr) {
  console.log('Updating available showtimes table:', timesArr);
  let table = document.getElementById('showtimeTable');

  // Clear existing rows in the table except the header row
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  // Populate the table with updated available showtimes
  for (let row of timesArr) {
    let trow = table.insertRow(-1); // Insert row at the end of the table
    let cell1 = trow.insertCell(0);
    let cell2 = trow.insertCell(1);
    let cell3 = trow.insertCell(2);
    let cell4 = trow.insertCell(3);

    // Populate columns with showtime data
    cell1.textContent = row.showtime_id;
    cell2.textContent = row.start_time;
    cell3.textContent = row.end_time;
    cell4.textContent = row.tickets_available;
  }
}

// Function to clear form inputs
function clearForm() {
  document.getElementById('userName').value = '';
  document.getElementById('showtimeId').value = '';
  document.getElementById('tickets').value = '';
}

// Function to modify showtimes (e.g., by a manager)
document
  .getElementById('modifyShowtime')
  .addEventListener('click', function () {
    const showtimeId = document.getElementById('modifyShowtimeId').value.trim();
    const ticketsAvailable = document
      .getElementById('modifyTicketsAvailable')
      .value.trim();
    const startTime = document.getElementById('modifyStartTime').value.trim();
    const endTime = document.getElementById('modifyEndTime').value.trim();
    const theaterId = document.getElementById('modifyTheaterId').value.trim();
    const is3D = document.getElementById('modifyIs3D').checked;

    // Validate inputs
    if (
      !showtimeId ||
      (!ticketsAvailable &&
        !startTime &&
        !endTime &&
        !theaterId &&
        is3D === undefined)
    ) {
      alert('Please provide a showtime ID and at least one field to update.');
      return;
    }

    // Construct the query string for modifying showtimes
    const updates = {
      showtimeId: showtimeId,
      tickets_available: ticketsAvailable || undefined,
      start_time: startTime || undefined,
      end_time: endTime || undefined,
      theater_id: theaterId || undefined,
      is_3D: is3D ? 'true' : 'false',
    };
    const queryString = queryObjectToString(updates);

    let AJAX = new XMLHttpRequest();
    AJAX.onerror = function () {
      alert('Network error while trying to modify the showtime.');
    };
    AJAX.onload = function () {
      if (this.status === 200) {
        const responseObj = JSON.parse(this.responseText);

        if (responseObj.updated) {
          alert('Showtime has been successfully updated.');
          sendLoadTimesRequest(); // Refresh available showtimes
        } else {
          alert(responseObj.message || 'Unable to modify the showtime.');
        }
      } else {
        alert('Error modifying the showtime.');
        console.error(`Status: ${this.status}, Response: ${this.responseText}`);
      }
    };

    // Set up and send the AJAX request
    AJAX.open('GET', `/modifyShowtime?${queryString}`);
    AJAX.send();
  });

// Utility function to convert an object to a query string for a URL
function queryObjectToString(query) {
  return Object.keys(query)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`
    )
    .join('&');
}
