import app from "./app";
import { logger } from "./lib/logger";

const port = Number(process.env["PORT"]) || 5000;

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
