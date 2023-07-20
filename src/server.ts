import { config } from 'dotenv';
import { resolve } from 'path';
import http, { createServer } from 'http';
export const BASE_PATH: string = __dirname;
config({ path: resolve(`${BASE_PATH}/../.env`) });

import app from './app';
import mongoose from 'mongoose';
import { connection } from './utils/dbConnection';
import { logger } from './utils/logger';
import sensorHelper from './components/sensor/sensor.helper';
import { manageSensorValue } from './middlewares/manageSensorValue';

const port = process.env.PORT || 3000;

const server = createServer(app);

connection.then(() => {
   logger.info('DB connected successfully');
   server.listen(port, () => {
      logger.info(`Server is running on ${port} with process id ${process.pid}`);
   });
});

// setInterval(function(){
   // manageSensorValue.manageValue()
// }, 60000*22)

// sensorHelper.getData("room_1", "0519adec-dcf7-40f2-a73d-3ca7cb3a3dcd", 118);

// Exit handler for server
function exitHandler() {
   server.close(() => {
      logger.info(`Http server closed.`);
      mongoose.connection.close();
      logger.info(`Mongoose connection disconnected`);
      process.exit(0);
   });
}

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`, `EADDRINUSE`].forEach((eventType) => {
   (process as NodeJS.EventEmitter).on(eventType, exitHandler.bind(null, eventType));
});
