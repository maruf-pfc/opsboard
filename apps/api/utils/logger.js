const morgan = require('morgan');

// Use 'dev' format for development, which gives colored status codes
// For production, you might want 'combined' which is more detailed
const logger = morgan('dev');

module.exports = logger;
