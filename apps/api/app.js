const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger');
const { errorHandler } = require('./middleware/errorMiddleware');
const swaggerDocs = require('./docs/swagger');
const chalk = require('chalk');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enhanced request logger: logs to file (winston) and console (chalk)
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
    const user = req.user
      ? chalk.cyan(req.user.email || req.user.id)
      : chalk.gray('Guest');
    const logMsg = [
      `[${new Date().toISOString()}]`,
      req.method,
      req.originalUrl,
      res.statusCode,
      `${duration}ms`,
      'IP:',
      req.ip,
      'User:',
      req.user ? req.user.email || req.user.id : 'Guest',
    ].join(' ');
    logger.info(logMsg);
    const prettyLog = [
      chalk.gray(`[${new Date().toISOString()}]`),
      chalk.magenta(req.method),
      chalk.blue(req.originalUrl),
      statusColor(res.statusCode),
      chalk.yellow(`${duration}ms`),
      chalk.white('IP:'),
      chalk.cyan(req.ip),
      chalk.white('User:'),
      user,
    ].join(' ');
    console.log(prettyLog);
  });
  next();
});

// Swagger API Docs
swaggerDocs(app);

// API Routes
// app.get("/", (req, res) => {
//   res.send("OpsBoard API is running...");
// });
app.use('/', require('./routes/indexRoutes'));

app.use('/api/v1/stats', require('./routes/statsRoutes'));
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/tasks', require('./routes/taskRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/classes', require('./routes/classRoutes'));
app.use('/api/v1/videos', require('./routes/videoRoutes'));
app.use('/api/v1/payments', require('./routes/paymentRoutes'));
app.use('/api/v1/marketing', require('./routes/marketingRoutes'));

// Global Error Handler Middleware (MUST be last)
app.use(errorHandler);

module.exports = app;
