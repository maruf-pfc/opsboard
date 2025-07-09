import express from 'express';
import cors from 'cors';
import chalk from 'chalk';

import logger from './utils/logger.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import swaggerDocs from './docs/swagger.js';

import indexRoutes from './routes/indexRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import classRoutes from './routes/classRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import emailMarketingRoutes from './routes/emailMarketingRoutes.js';
import contestVideoSolutionRoutes from './routes/contestVideoSolutionRoutes.js';
import programmingContestRoutes from './routes/programmingContestRoutes.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor =
      res.statusCode < 300
        ? chalk.green
        : res.statusCode < 400
          ? chalk.yellow
          : chalk.red;

    const timestamp = new Date().toISOString();
    const logMessage = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;

    // ✅ File log via Winston
    logger.info(`[${logMessage}`);

    // ✅ Console log with chalk
    console.log(
      [
        chalk.gray(`[${timestamp}]`),
        chalk.magenta(req.method),
        chalk.blue(req.originalUrl),
        statusColor(res.statusCode),
        chalk.yellow(`${duration}ms`),
      ].join(' '),
    );
  });

  next();
});

// Swagger API Docs
swaggerDocs(app);

// API Routes
app.use('/', indexRoutes);

app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/classes', classRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/email-marketing', emailMarketingRoutes);
app.use('/api/v1/contest-video-solutions', contestVideoSolutionRoutes);
app.use('/api/v1/programming-contests', programmingContestRoutes);

// Global Error Handler Middleware (MUST be last)
app.use(errorHandler);

export default app;
