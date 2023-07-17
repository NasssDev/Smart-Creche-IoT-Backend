import { createLogger, transports, format } from 'winston';
import { existsSync, mkdirSync } from 'fs';
import { BASE_PATH } from '../../server';

class Logger {
   // public logger: any;
   static level: string = process.env.ENV === 'development' ? 'debug' : 'info';

   // return the file path for log file
   static filePath = () => {
      const dir = `${BASE_PATH}/../logs`;
      if (!existsSync(dir)) {
         mkdirSync(dir);
      }
      return dir + `/logs-${new Date().toDateString()}-.log`;
   };

   // set file transport object
   static fileOption = () => {
      return {
         filename: Logger.filePath(),
         maxsize: 16777216, // Maximum size of a log file should be 16MB
         maxFiles: 64, // Maximum 64 file of 16 MB to be stored. i.e Max 1GB of logs can be stored
         handleExceptions: true
      };
   };

   // set console transport object
   static consoleOption = () => {
      return {
         // format: format.combine( format.colorize({ all: true })),
         handleExceptions: true
      };
   };

   // create transport array
   static transportList = () => {
      return [new transports.Console(Logger.consoleOption()), new transports.File(Logger.fileOption())];
   };

   // create logger object while constructing
   public static logger = createLogger({
      level: Logger.level,
      format: format.combine(format.json(), format.colorize({ all: true })),
      transports: Logger.transportList(),
      exceptionHandlers: [
         new transports.File({
            filename: `${BASE_PATH}/../logs/exceptions.log`,
            maxsize: 16777216
         })
      ],
      exitOnError: true
   });
}
const logger = Logger.logger;
export default logger;
