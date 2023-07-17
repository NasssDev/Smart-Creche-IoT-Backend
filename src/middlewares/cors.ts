import express from 'express';
import cors from 'cors';

class CORS {
   init(app: express.Application) {
      app.use(cors());
   }
}

export const corsObj = new CORS();
