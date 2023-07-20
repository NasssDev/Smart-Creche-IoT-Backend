import express from 'express';
import cors from 'cors';
const allowedOrigins = ['http://localhost:3000', 'https://iot-backend-ym14.onrender.com'];
const options: cors.CorsOptions = {
   origin: allowedOrigins
 };
class CORS {


   init(app: express.Application) {
      app.use(cors(options));
   }
}

export const corsObj = new CORS();
