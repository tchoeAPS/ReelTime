document.addEventListener('DOMContentLoaded', () => {
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const signInButton = document.querySelector('button');

  signInButton.addEventListener('click', (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }

    fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then(async (response) => {
        // Parse the JSON response regardless of the status code
        const data = await response.json();
        if (response.ok) {
          return data;
        } else {
          // Throw an error with the message from the server
          throw new Error(data.message || 'Login failed');
        }
      })
      .then((data) => {
        console.log('API response data:', data);
        if (data.message === 'Login successful') {
            localStorage.setItem('userFullName', data.employee_fullname);
            window.location.href = 'reeltime.html'; 
        } else {
            alert('Invalid username or password.');
        }
    })
    
      .catch((error) => {
        console.error('Login error:', error);
        alert(
          error.message ||
            'Login failed. Please check your username and password.'
        );
      });
  });
});
