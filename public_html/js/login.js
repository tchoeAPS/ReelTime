document.addEventListener('DOMContentLoaded', () => {
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const signInButton = document.querySelector('button');

  signInButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('API response data:', data);

        if (data.message === 'Login successful') {
          const employeeData = data.data;
          localStorage.setItem('userFullName', employeeData.employee_fullname);
          localStorage.setItem('adminFlag', employeeData.admin_flag);
          localStorage.setItem('employeeCinemaId', employeeData.cinema_id);
          localStorage.setItem('employeeCinemaName', employeeData.cinema_name);
          window.location.href = 'reeltime.html';
        } else {
          alert('Invalid username or password.');
        }
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(
        error.message ||
          'Login failed. Please check your username and password.'
      );
    }
  });
});
