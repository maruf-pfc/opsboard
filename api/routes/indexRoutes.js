import express from 'express';
import mongoose from 'mongoose';
import asyncHandler from '../utils/asyncHandler.js';
import programmingContestRoutes from './programmingContestRoutes.js';

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    // Real health check logic: Is the database connected?
    const isHealthy = mongoose.connection.readyState === 1;

    const status = isHealthy ? 'Online' : 'Offline';
    const statusColor = isHealthy ? '#1abc9c' : '#e74c3c'; // Green for Online, Red for Offline
    const emoji = isHealthy ? '🚀' : '⚠️';

    res.setHeader('Content-Type', 'text/html');
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CPS Task Manager</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
        <style>
          body {
            margin: 0;
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            text-align: center;
            overflow: hidden;
          }
          .container {
            background: rgba(0, 0, 0, 0.2);
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
          }
          h1 {
            font-size: 3rem;
            margin-bottom: 10px;
            font-weight: 700;
            letter-spacing: -1px;
          }
          p {
            font-size: 1.25rem;
            opacity: 0.9;
          }
          .tag {
            margin-top: 25px;
            display: inline-block;
            padding: 10px 20px;
            background-color: ${statusColor};
            color: #fff;
            border-radius: 8px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 4px 15px ${statusColor}55;
            transition: transform 0.2s ease-in-out;
          }
          .tag:hover {
              transform: translateY(-2px);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${emoji} CPS Task Manager API <br /> Reimagine how your team collaborates.</h1>
          <p>Align your team, accelerate your progress.</p>
          <div class="tag">Status: ${status}</div>
          <p>The backend API is currently ${status.toLowerCase()}.</p>
        </div>
      </body>
      </html>
    `);
  }),
);

// Optionally expose programming contests from index
router.use('/api/v1/programming-contests', programmingContestRoutes);

export default router;
