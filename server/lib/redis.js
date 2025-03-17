const Redis = require("ioredis");
const logger = require("../config/logger");

const isDevelopment = process.env.NODE_ENV !== "production";

const redis = new Redis({
  host: process.env.REDIS_HOST || (isDevelopment ? "localhost" : "redis"),
  port: parseInt(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: 5,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  enableReadyCheck: true,
  reconnectOnError(err) {
    logger.error(`Redis reconnect on error: ${err}`);
    return true;
  },
});

redis.on("error", (err) => {
  logger.error("Redis Client Error:", err);
});

redis.on("connect", () => {
  logger.info("Redis Client Connected");
});

redis.on("ready", () => {
  logger.info("Redis Client Ready");
});

module.exports = redis;
