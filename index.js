import app from './app.js';
import logger from './src/config/logging.js';

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  logger.info(`Express server listening on localhost: ${PORT}`);
});
