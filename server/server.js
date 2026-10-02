import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', apiRoutes);

// Root health check
app.get('/', (req, res) => {
  res.json({ message: 'Cookscape Backend API Server is running.' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`✓ Cookscape Node.js API server running on http://localhost:${PORT}`);
});

export default app;
