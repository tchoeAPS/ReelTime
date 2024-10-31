const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// example of GET API
app.get('/api/movies', (req, res) => {
    // write sql query to get all movies and return in response
    console.log('TODO: Get all movies');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});