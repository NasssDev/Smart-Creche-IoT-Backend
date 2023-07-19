import * as bluebird from 'bluebird';
import * as redis from 'redis';
import { logger } from '../logger';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

export const redisClient = redis.createClient({
   port: 19272, //Number(process.env.REDIS_PORT),
   host: 'redis-19272.c92.us-east-1-3.ec2.cloud.redislabs.com', //process.env.REDIS_HOST,
   password: '2G9KYjoQmvtCm9beKs1qrIDJB6oEOrQd', //process.env.REDIS_PASS,
   // db: process.env.REDIS_DB,
   retry_strategy: (options) => {
      if (options.error && options.error.code === 'ECONNREFUSED') {
         // End reconnecting on a specific error and flush all commands with
         // a individual error
         return new Error('The server refused the connection');
      }

      if (options.total_retry_time > 1000 * 60 * 60) {
         // End reconnecting after a specific timeout and flush all commands
         // with a individual error
         return new Error('Retry time exhausted');
      }

      if (options.attempt > 10) {
         // End reconnecting with built in error
         return undefined;
      }
      // reconnect after
      return Math.min(options.attempt * 100, 3000);
   }
});

redisClient.on('error', (err) => {
   logger.error(`Redis connection error on  ${new Date()}`, err);
});

redisClient.on('ready', (success) => {
   logger.info(`Redis is ready for use`);
});

redisClient.on('connect', (success) => {
   logger.info(`Redis is connected successfully `);
});

redisClient.on('reconnecting', (success) => {
   logger.info(`Redis is reconnecting: ${new Date()} `);
});

redisClient.on('end', (end) => {
   logger.info(`Redis server connection has closed: ${new Date()}`);
});

redisClient.on('warning', (warning) => {
   logger.warn(`Redis password was set but none is needed: ${new Date()} `);
});
