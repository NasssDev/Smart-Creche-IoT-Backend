import express from 'express';
const CronJob = require('cron').CronJob;
import { routes } from './routes/index';
import { middlewares } from './middlewares/index';

class App {
   public app: express.Application;

   constructor() {
      this.app = express();
      this.middlewares();
      this.mountRoutes();
   }

   private middlewares(): void {
      middlewares.init(this.app);
   }

   private mountRoutes(): void {
      routes.init(this.app);
      this.app.get('/', (req, res) => {
         res.send('Hello, Welcome to xFeat Application');
      });
   }
}

export default new App().app;
