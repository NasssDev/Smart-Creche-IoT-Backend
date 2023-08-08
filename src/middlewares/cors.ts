import express from 'express';
import cors from 'cors';
class CORS {
private allowedOrigin = [
         'http://localhost:5173',
         'http://localhost:5174',
         'https://smart-creche.vercel.app'
      ];

   init(app: express.Application) {
      app.use(cors({
         origin: this.allowedOrigin,
         method: 'GET,HEAD,PUT,PATCH,POST,DELETE',
         credential:  true,
         exposedHeaders: ["*"]
      }));
   }
}

export const corsObj = new CORS();
