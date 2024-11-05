require('dotenv').config();

const winston = require('winston');
require('winston-daily-rotate-file');

const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// DailyRotateFile transport for logs
const transport = new winston.transports.DailyRotateFile({
    filename: 'logs/%DATE%-results.log',  // Log file naming convention
    datePattern: 'YYYY-MM-DD',             // Date format
    zippedArchive: true,                   // Compress old log files
    maxSize: '20m',                        // Maximum size of a log file
    maxFiles: '14d',                       // Retain logs for 14 days
    level: 'info',                         // Level for the daily rotated log
});

// Create a logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info', // Log level from env or default to 'info'
    format: winston.format.combine(
        winston.format.timestamp(), // Add timestamp to each log entry
        winston.format.json() // Format log entries as JSON
    ),
    transports: [
        // Console transport
        new winston.transports.Console({
            format: winston.format.simple(), // Simple format for console logs
        }),
        // Error logging file
        new winston.transports.File({
            filename: 'error.log',
            level: 'error', // Log errors to error.log
        }),
        // Combined log file for all log levels
        new winston.transports.File({
            filename: 'combined.log' // Save all logs to combined.log
        }),
        // Add the daily rotate transport
        transport, // Include daily rotate transport
    ],
});

// Export the logger
module.exports = logger;
