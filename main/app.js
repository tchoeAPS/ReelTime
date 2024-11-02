import express from 'express';
import routes from './routes.js';
import { dbMiddleware } from './middleware.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(dbMiddleware);
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
