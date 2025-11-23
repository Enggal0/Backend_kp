import app from './app.js';
import logger from './src/config/logging.js';

// Normalize PORT from environment and trim stray whitespace/newlines
const rawPort = process.env.PORT;
const PORT = rawPort ? rawPort.toString().trim() : '8080';

app.listen(PORT, () => {
  logger.info(`Express server listening on localhost: ${PORT}`);
});
