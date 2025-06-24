const express = require("express");
const cors = require("cors");
const logger = require("./utils/logger");
const { errorHandler } = require("./middleware/errorMiddleware");
const swaggerDocs = require("./docs/swagger");

const app = express();

app.use(express.json());
app.use(cors());
app.use(logger);

// Swagger API Docs
swaggerDocs(app);

// API Routes
// app.get("/", (req, res) => {
//   res.send("OpsBoard API is running...");
// });
app.use('/', require('./routes/indexRoutes'));

app.use('/api/v1/stats', require('./routes/statsRoutes'));
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/tasks", require("./routes/taskRoutes"));
app.use("/api/v1/users", require("./routes/userRoutes"));
app.use("/api/v1/classes", require("./routes/classRoutes"));
app.use("/api/v1/videos", require("./routes/videoRoutes"));
app.use('/api/v1/payments', require('./routes/paymentRoutes'));
app.use('/api/v1/marketing', require('./routes/marketingRoutes'));

// Global Error Handler Middleware (MUST be last)
app.use(errorHandler);

module.exports = app;
