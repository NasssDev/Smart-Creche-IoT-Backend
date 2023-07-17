'use strict';

import bodyParser from 'body-parser';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { corsObj } from './cors';
import { Constants } from '../utils/constants';
import * as uuid from 'uuid';

class Middlewares {
   public init(app: express.Application) {
      // Enable compression

      // Prevent opening page in frame or iframe to protect from clickjacking
      app.use(helmet.frameguard());

      // Remove X-Powered-By
      app.use(helmet.hidePoweredBy());

      // Prevents browser from caching and storing page
      //app.use(helmet.noCache());

      // Allow communication only on HTTPS
      app.use(helmet.hsts());

      // Enable XSS filter in IE (On by default)
      app.use(helmet.xssFilter());

      app.use((req: Request, res: Response, next: NextFunction) => {
         req['uuid'] = uuid.v4();
         next();
      });

      // Eanble CORS support
      corsObj.init(app);

      // used to serialize the user for the session
      // passport.serializeUser(function (user, done) {
      //    done(null, user);
      // });

      // passport.use(
      //    new FacebookStrategy(Constants.FACEBOOK_AUTH_STRATEGY_CONFIG, function (
      //       accessToken,
      //       refreshToken,
      //       profile,
      //       cb
      //    ) {
      //       return cb(null, { profile, accessToken, refreshToken });
      //    })
      // );

      // passport.use(
      //    new GoogleStrategy(Constants.GOOGLE_AUTH_STRATEGY_CONFIG, function (accessToken, refreshToken, profile, cb) {
      //       return cb(null, { profile, accessToken, refreshToken });
      //    })
      // );

      // passport.use(
      //    new FacebookTokenStrategy(Constants.FACEBOOK_AUTH_STRATEGY_CONFIG, function (
      //       accessToken,
      //       refreshToken,
      //       profile,
      //       cb
      //    ) {
      //       return cb(null, { profile, accessToken, refreshToken });
      //    })
      // );

      // passport.use(
      //    new GoogleTokenStrategy(Constants.GOOGLE_AUTH_STRATEGY_CONFIG, function (
      //       accessToken,
      //       refreshToken,
      //       profile,
      //       cb
      //    ) {
      //       return cb(null, { profile, accessToken, refreshToken });
      //    })
      // );

      // Enable request body parsing
      app.use(
         bodyParser.urlencoded({
            extended: true,
            limit: '20mb'
         })
      );

      // Enable request body parsing in JSON format
      app.use((req, res, next) => {
         if (req.originalUrl === '/api/payment/stripe/webhook') {
            next();
         } else {
            bodyParser.json({
               limit: '20mb'
            })(req, res, next);
         }
      });

      // Enable cookie parsing
      app.use(cookieParser());

      // app.use(i18n.init);

      // app.use(json2xls.middleware);
   }
}

export const middlewares = new Middlewares();
