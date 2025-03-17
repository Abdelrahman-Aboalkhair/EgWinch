const { Queue } = require("bullmq");
const redisConfig = require("../config/redisConfig");

const emailQueue = new Queue("emailQueue", redisConfig);

module.exports = emailQueue;
