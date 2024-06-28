// src/redisConfig.ts
import { RedisOptions } from 'ioredis';
import dotenv from 'dotenv'
dotenv.config();

console.log(process.env.REDIS_HOST);
console.log(process.env.REDIS_PORT);
console.log(process.env.REDIS_PASSWORD);
process.env.REDIS_HOST
const redisOptions: RedisOptions = {
  host: process.env.REDIS_HOST,
  port: 11923,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
  // Add other options as needed
};

export default redisOptions;