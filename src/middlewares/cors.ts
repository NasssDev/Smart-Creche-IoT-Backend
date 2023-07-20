import express from 'express';
import cors from 'cors';
class CORS {


   init(app: express.Application) {
      app.use(cors({
         origin: "*",
         method: 'GET,HEAD,PUT,PATCH,POST,DELETE',
         credential:  true,
         exposedHeaders: ["*"]
      }));
   }
}

export const corsObj = new CORS();
