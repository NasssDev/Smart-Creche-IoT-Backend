import axios from 'axios';
import * as _ from 'lodash';
import jwt from 'jsonwebtoken';
import HttpStatus from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

import { Helper } from '../../utils/helper';
import logger from '../../utils/logger/logger';
import { UserRecord } from '../user/user.model';
import { Constants } from '../../utils/constants';

import { AccountRecord } from '../account/account.model';
import { SessionRecord } from '../session/session.model';

interface TokenData {
   token: string;
   expiresIn: number | string;
}

interface DataStoredInToken {
   email: string;
   id: string;
   roleId?: string;
   accountId?: string;
   sessionId?: string;
}

class Common {
   /**
    *
    * @param req
    * @param res
    * @param next
    */
   public async authenticateToken(req: Request, res: Response, next: NextFunction) {
      try {
         const token = req.headers.authorization;
         if (token) {
            jwt.verify(token, Constants.TOKEN_SECRET.KEY, async (err, decoded) => {
               if (err) {
                  return Helper.createResponse(res, HttpStatus.UNAUTHORIZED, `Unauthorized access`, {});
               }
               let sessionDetail;

               /** verify session */
               if (decoded?.sessionId) {
                  sessionDetail = await SessionRecord.findOne({ _id: decoded.sessionId }, '_id userId');

                  if (!sessionDetail) {
                     return Helper.createResponse(res, HttpStatus.UNAUTHORIZED, `Unauthorized access`, {});
                  }

                  req['session'] = sessionDetail;
               }

               const [user] = await Promise.all([
                  /** get user detail */
                  UserRecord.findOne({ _id: decoded.id }),
                  /** update session detail */
                  new Promise(async (resolve, reject) => {
                     if (!sessionDetail) return resolve(true);

                     await SessionRecord.updateOne({ _id: sessionDetail._id }, { $set: { expireOn: new Date() } });
                     return resolve(true);
                  })
               ]);
               if (!user) {
                  return Helper.createResponse(res, HttpStatus.UNAUTHORIZED, `Unauthorized access`, {});
               }
               req['user'] = user;
               req['tokenData'] = decoded;

               req.body.user = user;
               req.body.tokenData = decoded;
               res['setLocale'](_.get(user, 'language', 'en'));
               next();
            });
         } else {
            Helper.createResponse(res, HttpStatus.UNAUTHORIZED, `Token required`, {});
            return;
         }
      } catch (error) { }
   }

   /**
    *
    * @param req
    * @param res
    * @param next
    */
   public async authenticateAccount(req: Request, res: Response, next: NextFunction) {
      try {
         const { accountId } = req.body?.tokenData;
         const account = await AccountRecord.findOne({ _id: accountId });
         if (account) {
            req['account'] = account;
            req.body.account = account;
            next();
         } else {
            return Helper.createResponse(res, HttpStatus.FORBIDDEN, `Please select account`, {});
         }
      } catch (error) {
         return Helper.createResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, `Something went wrong`, {});
      }
   }

   /**
    *
    * @param data
    */
   public createToken({ user, userRole, session }: { user; userRole?; session?}): TokenData {
      try {
         const expiresIn = Constants.JWT_TOKEN_EXPIRE_IN;
         const secret = Constants.TOKEN_SECRET.KEY;
         let dataStoredInToken: DataStoredInToken = {
            email: user.email,
            id: user._id,
            roleId: userRole?.roleId,
            accountId: userRole?.accountId,
            sessionId: session?._id
         };
         
         return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn })
         };
      } catch (error) {
         logger.error(__filename, { custom_message: 'An error occurred while generate JWT token', error });
         throw error;
      }
   }

   /**
    * @description create set password token
    * @param param0
    * @returns
    */
   public createSetPasswordToken({ data, expiresIn = Constants.OTHER_TOKEN_EXPIRE_IN }: { data: any; expiresIn?}) {
      try {
         const secret = Constants.TOKEN_SECRET.KEY;
         console.log(data, expiresIn);
         return {
            expiresIn,
            token: jwt.sign(data, secret, { expiresIn })
         };
      } catch (error) {
         logger.error(__filename, { custom_message: 'An error occurred while generate JWT token', error });
         throw error;
      }
   }

   /**
    *
    * @param token
    */
   public decodeToken(token: string) {
      const data = jwt.decode(token, { complete: true });
      return data;
   }

   public allowOnlyAdmin(data) {
      return data.role && (_.toLower(data.role) === 'admin' || _.toLower(data.role) === 'owner') ? true : false;
   }

}

export default new Common();
