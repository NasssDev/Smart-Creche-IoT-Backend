'use strict';

import { redisClient } from './redis';

class RedisService {
   constructor() {}

   /**
    * This will set key value pair in redis.
    *
    * It will also set expiry time in seconds if it is applied.
    *
    * @param {any} key     e.g. 'abc'
    * @param {any} value    e.g. 'xyz'
    * @param {integer} time  e.g. 10 (seconds)
    * @return {Promise<any>}
    */
   redisSetValue(key, value, time, options = []) {
      return new Promise((resolve, reject) => {
         try {
            time = parseInt(time);
            if (time > 0) {
               redisClient
                  .setAsync(key, value, 'EX', time, ...options)
                  .then((res) => {
                     resolve(res);
                  })
                  .catch((err) => {
                     reject(err);
                  });
            } else {
               redisClient
                  .setAsync(key, value, 'KEEPTTL')
                  .then((res) => {
                     resolve(res);
                  })
                  .catch((err) => {
                     reject(err);
                  });
            }
         } catch (e) {
            reject(e);
         }
      });
   }

   redisGetValue(key) {
      return new Promise((resolve, reject) => {
         try {
            redisClient
               .getAsync(key)
               .then((res) => {
                  resolve(JSON.parse(res));
               })
               .catch((err) => {
                  reject(err);
               });
         } catch (e) {
            reject(e);
         }
      });
   }

   redisDeleteKey(key) {
      return new Promise((resolve, reject) => {
         try {
            redisClient
               .delAsync(key)
               .then((response) => {
                  resolve(response);
               })
               .catch((err) => {
                  reject(err);
               });
         } catch (e) {
            reject(e);
         }
      });
   }

   redisHMSet(baseKey, object) {
      return new Promise((resolve, reject) => {
         try {
            redisClient
               .hmsetAsync(baseKey, object)
               .then((response) => {
                  resolve(response);
               })
               .catch((err) => {
                  reject(err);
               });
         } catch (e) {
            reject(e);
         }
      });
   }

   redisHMGet(baseKey, keyList) {
      return new Promise((resolve, reject) => {
         try {
            redisClient
               .hmgetAsync(baseKey, keyList)
               .then((response) => {
                  resolve(response);
               })
               .catch((err) => {
                  reject(err);
               });
         } catch (e) {
            reject(e);
         }
      });
   }

   redisHSetStore(baseKey, key, value) {
      return new Promise((resolve, reject) => {
         try {
            redisClient
               .hsetAsync(baseKey, key, value)
               .then((response) => {
                  resolve(response);
               })
               .catch((err) => {
                  reject(err);
               });
         } catch (e) {
            reject(e);
         }
      });
   }

   redisHGet(baseKey, key) {
      return new Promise((resolve, reject) => {
         try {
            redisClient
               .hgetAsync(baseKey, key)
               .then((response) => {
                  resolve(response);
               })
               .catch((err) => {
                  reject(err);
               });
         } catch (e) {
            reject(e);
         }
      });
   }
}

export const redisService = new RedisService();
