const morgan = require("morgan");
const logger = require("./logger");

const format = ":method :url :status :response-time ms - :res[content-length]";

const successHandler = morgan(format, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) },
});

const errorHandler = morgan(format, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) },
});

module.exports = {
  successHandler,
  errorHandler,
};
