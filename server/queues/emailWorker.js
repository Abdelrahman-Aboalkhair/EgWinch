const { Worker } = require("bullmq");
const sendEmail = require("../utils/sendEmail");
const redisConfig = require("../config/redis");
const logger = require("../config/logger");

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    logger.info(`Starting to process email job ${job.id}`);
    console.log("Job data:", job.data); // Debug job data

    if (job.name === "sendVerificationEmail") {
      const { to, subject, text, html } = job.data;

      try {
        const result = await sendEmail({
          to,
          subject,
          text,
          html,
        });

        logger.info(`Email sent successfully to ${to}`);
        return result;
      } catch (error) {
        logger.error(`Failed to send email: ${error.message}`);
        throw error;
      }
    }
  },
  redisConfig
);

// Add more detailed event listeners
emailWorker.on("failed", (job, err) => {
  logger.error(`Job ${job?.id} failed with error: ${err.message}`);
  console.error("Job failure details:", err);
});

emailWorker.on("completed", (job) => {
  logger.info(`Job ${job.id} completed successfully`);
});

emailWorker.on("error", (err) => {
  logger.error("Worker error:", err);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  await emailWorker.close();
});

module.exports = emailWorker;
