import express from 'express';
import routes from './API/routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dbMiddleware } from './middleware.js';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(dbMiddleware);
app.use(express.static(path.join(__dirname, 'public_html')));
app.use('/api', routes);

async function startServer() {
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Error starting server:', error);
});
