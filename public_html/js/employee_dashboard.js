document.addEventListener('DOMContentLoaded', () => {
  let employees = [];

  // DOM Elements
  const modal = document.getElementById('newEmployeeModal');
  const newEmployeeBtn = document.querySelector('.new-employee-btn');
  const searchBar = document.querySelector('.search-bar input');
  const employeeTable = document.querySelector('tbody');
  const closeBtn = document.getElementById('closeModal');
  const saveButton = document.getElementById('saveEmployeeBtn');
  const cinemaDropdown = document.getElementById('cinemaSelect');

  // Fetch employees from the API
  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/employees');
      if (!response.ok) throw new Error('Failed to fetch employees');
      employees = await response.json();
      renderTable(employees);
    } catch (error) {
      employeeTable.innerHTML = `
          <tr>
            <td colspan="5" style="text-align: center;">Failed to load data. Please try again later.</td>
          </tr>
        `;
      console.error('Error fetching employees:', error);
    }
  };

  // Render employee table
  const renderTable = (employeeList) => {
    employeeTable.innerHTML = '';
    if (employeeList.length === 0) {
      employeeTable.innerHTML = `
          <tr>
            <td colspan="5" style="text-align: center;">No employees found.</td>
          </tr>
        `;
      return;
    }

    employeeList.forEach((employee) => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${employee.employee_fullname}</td>
          <td>${employee.employee_id}</td>
          <td>${employee.jobtitle}</td>
          <td>${employee.cinema_name}</td>
        `;
      employeeTable.appendChild(row);
    });
  };

  // Search employees
  const searchEmployees = async (query) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/employeesFilter?employee_fullname=${query}`
      );
      if (!response.ok) throw new Error('Failed to fetch employees');
      employees = await response.json();
      renderTable(employees);
    } catch (error) {
      employeeTable.innerHTML = `
          <tr>
            <td colspan="5" style="text-align: center;">Failed to load data. Please try again later.</td>
          </tr>
        `;
      console.error('Error searching employees:', error);
    }
  };

  // Fetch cinemas and populate dropdown
  const populateCinemaDropdown = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/cinemas');
      if (!response.ok) throw new Error('Failed to fetch cinema data');

      const cinemas = await response.json();
      cinemaDropdown.innerHTML = '<option value="">Select Cinema</option>';
      cinemas.forEach((cinema) => {
        const option = document.createElement('option');
        option.value = cinema.cinema_id;
        option.textContent = cinema.cinema_name;
        cinemaDropdown.appendChild(option);
      });
    } catch (error) {
      console.error('Error fetching cinemas:', error);
      alert('Failed to load cinemas. Please try again.');
    }
  };

  // Add new employee
  const addNewEmployee = async () => {
    try {
      const employee_fullname = document.querySelector(
        '.modal-body input[placeholder="Employee Name"]'
      ).value;
      const username = document.querySelector(
        '.modal-body input[placeholder="Employee Username"]'
      ).value;
      const emp_password = document.querySelector(
        '.modal-body input[placeholder="Employee Password"]'
      ).value;
      const emp_email = document.querySelector(
        '.modal-body input[placeholder="Employee Email"]'
      ).value;
      const admin_flag = document.querySelector(
        '.modal-body input[placeholder="Admin Flag"]'
      ).value;
      const jobtitle = document.querySelector(
        '.modal-body input[placeholder="Employee Job Title"]'
      ).value;
      const cinema_id = cinemaDropdown.value;

      if (!cinema_id) {
        alert('Please select a Cinema ID.');
        return;
      }

      const employeeData = {
        employee_fullname,
        username,
        emp_password,
        emp_email,
        admin_flag,
        jobtitle,
        cinema_id,
      };

      const response = await fetch('http://localhost:3000/api/newEmployee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) {
        throw new Error('Failed to add employee');
      }

      const data = await response.json();
      alert('Employee added successfully!');

      // Clear the input fields
      document.querySelector(
        '.modal-body input[placeholder="Employee Name"]'
      ).value = '';
      document.querySelector(
        '.modal-body input[placeholder="Employee Username"]'
      ).value = '';
      document.querySelector(
        '.modal-body input[placeholder="Employee Password"]'
      ).value = '';
      document.querySelector(
        '.modal-body input[placeholder="Employee Email"]'
      ).value = '';
      document.querySelector(
        '.modal-body input[placeholder="Admin Flag"]'
      ).value = '';
      document.querySelector(
        '.modal-body input[placeholder="Employee Job Title"]'
      ).value = '';
      cinemaDropdown.value = ''; // Reset the cinema dropdown

      modal.style.display = 'none'; // Close the modal
      fetchEmployees(); // Refresh employee table
    } catch (error) {
      console.error('Error adding employee:', error);
      alert(`Error adding employee. Please try again.`);
    }
  };

  // Event listeners
  newEmployeeBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    populateCinemaDropdown(); // Load dropdown when modal opens
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  saveButton.addEventListener('click', addNewEmployee);

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  searchBar.addEventListener('input', (e) => searchEmployees(e.target.value));

  // Initial fetch
  fetchEmployees();
});
