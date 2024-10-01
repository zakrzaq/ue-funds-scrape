import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

const logger = createLogger({
  level: "info", // Default log level
  format: combine(
    colorize(), // Colorize log output
    timestamp(), // Add timestamps to the log
    logFormat, // Use the custom log format
  ),
  transports: [
    new transports.Console(), // Log to the console
    new transports.File({ filename: "app.log" }), // Log to a file
  ],
});

export default logger;
