const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const qs = require('./reeltimeQuery.js');
const utils = require('./utils.js');

// Serve static files (HTML, CSS, JS, Images)
function serveStaticFile(filePath, res) {
    const extension = path.extname(filePath).toLowerCase();
    let contentType = 'text/html'; // Default content type

    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'application/javascript';
            break;
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.json':
            contentType = 'application/json';
            break;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(`Error serving static file: ${filePath}`, err);
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'not_found', message: `'${filePath}' not found` }));
            return;
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
}

// Handle dynamic API requests
function handleIncomingRequest(req, res) {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    switch (pathname) {
        case '/getMovies': // Fetch all movies
            console.log('Fetching movies for dropdown...');
            qs.getMovies(res);
            break;

        case '/updateShowtimeWithMovie': // Update a showtime's movie
            if (req.method === 'GET') {
                const showtimeId = parseInt(query.showtimeId, 10);
                const movieId = parseInt(query.movieId, 10);

                if (!isNaN(showtimeId) && !isNaN(movieId)) {
                    console.log(`Updating showtime ${showtimeId} with movie ${movieId}...`);
                    qs.updateShowtimeWithMovie(res, showtimeId, movieId);
                } else {
                    console.error('Invalid or missing parameters for updating showtime.');
                    utils.sendJSONObj(res, 400, { error: "Invalid or missing parameters: showtimeId and movieId are required." });
                }
            } else {
                console.error('Invalid method for /updateShowtimeWithMovie');
                utils.sendJSONObj(res, 405, { error: "Method Not Allowed" });
            }
            break;

        case '/getShowtimesByTheater': // Fetch all showtimes for a theater
            if (req.method === 'GET') {
                const theaterId = parseInt(query.theaterId, 10);

                if (!isNaN(theaterId)) {
                    console.log(`Fetching showtimes for theater ${theaterId}...`);
                    qs.getShowtimesByTheater(res, theaterId);
                } else {
                    console.error('Invalid or missing parameter for theaterId.');
                    utils.sendJSONObj(res, 400, { error: "Invalid or missing parameter: theaterId is required." });
                }
            } else {
                console.error('Invalid method for /getShowtimesByTheater');
                utils.sendJSONObj(res, 405, { error: "Method Not Allowed" });
            }
            break;

        case '/api/getShowtimesByMovie': // Fetch showtimes by movie ID
            if (req.method === 'GET') {
                const movieId = parseInt(query.movieId, 10);

                if (!isNaN(movieId)) {
                    console.log(`Fetching showtimes for movie ${movieId}...`);
                    qs.getShowtimesByMovie(res, movieId);
                } else {
                    console.error('Invalid or missing parameter for movieId.');
                    utils.sendJSONObj(res, 400, { error: "Invalid or missing parameter: movieId is required." });
                }
            } else {
                console.error('Invalid method for /api/getShowtimesByMovie');
                utils.sendJSONObj(res, 405, { error: "Method Not Allowed" });
            }
            break;

        case '/addShowtime': // Add a new showtime
            if (req.method === 'POST') {
                console.log('Adding a new showtime...');
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    const showtimeData = JSON.parse(body);
                    const { startTime, endTime, tickets, theaterId, movieId } = showtimeData;

                    if (startTime && endTime && !isNaN(tickets) && !isNaN(theaterId) && !isNaN(movieId)) {
                        qs.addShowtime(res, startTime, endTime, tickets, theaterId, movieId);
                    } else {
                        console.error('Invalid or missing data for adding showtime.');
                        utils.sendJSONObj(res, 400, { error: "Missing or invalid showtime data." });
                    }
                });
            } else {
                console.error('Invalid method for /addShowtime');
                utils.sendJSONObj(res, 405, { error: "Method Not Allowed" });
            }
            break;

        // Serve static pages
        case '/manage_showtimes.html':
            console.log('Serving manage_showtimes.html');
            serveStaticFile(path.join(__dirname, 'public_html', 'manage_showtimes.html'), res);
            break;

        case '/cinemaadminlaunchpad.html':
            console.log('Serving cinemaadminlaunchpad.html');
            serveStaticFile(path.join(__dirname, 'public_html', 'cinemaadminlaunchpad.html'), res);
            break;

        // Default handler for other files
        default:
            if (pathname.startsWith('/images/')) {
                console.log(`Serving image: ${pathname}`);
                serveStaticFile(path.join(__dirname, 'public_html', pathname), res);
            } else {
                console.log(`Serving static file: ${pathname}`);
                serveStaticFile(path.join(__dirname, 'public_html', pathname), res);
            }
            break;
    }
}

// Create and start the server
const server = http.createServer(handleIncomingRequest);

server.listen(80, () => {
    console.log('Server running on port 80');
});
