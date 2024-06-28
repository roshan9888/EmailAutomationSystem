"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log(process.env.REDIS_HOST);
console.log(process.env.REDIS_PORT);
console.log(process.env.REDIS_PASSWORD);
process.env.REDIS_HOST;
const redisOptions = {
    host: process.env.REDIS_HOST,
    port: 11923,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
    // Add other options as needed
};
exports.default = redisOptions;
