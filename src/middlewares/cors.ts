import express from 'express';
import cors from 'cors';
class CORS {
const allowedOrigin = [
         'http://localhost:5173',
         'http://localhost:5174'
      ];

   init(app: express.Application) {
      app.use(cors({
         origin: allowedOrigin,
         method: 'GET,HEAD,PUT,PATCH,POST,DELETE',
         credential:  true,
         exposedHeaders: ["*"]
      }));
   }
}

export const corsObj = new CORS();
