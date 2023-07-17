'use strict';
import { NextFunction, Response } from 'express';
import moment from 'moment';
import * as bcrypt from 'bcrypt';
import { readFileSync } from 'fs';
import * as hbs from 'handlebars';
import HttpStatus from 'http-status-codes';

import { logger } from '../logger';
import { mailer } from '../mailer';
import { BASE_PATH } from '../../server';

export class Helper {
   /**
    *
    * @param res
    * @param status
    * @param message
    * @param payload
    */
   static createResponse(res, status, message, payload): any {
      return res.status(status).json({
         status: status,
         message: message,
         payload: payload
      });
   }

   /**
    * @description Create Response
    * @param {Object} res
    * @param {Number} status
    * @param {String} message
    * @param {Object} payload
    * @param {Object} pager
    */
   static createResponseV2 = ({
      message,
      payload = {},
      res,
      status
   }: // pager
   // code
   {
      res: Response;
      status: any;
      message: string;
      payload?: object;
      // pager?: object;
      // code?: string;
   }) => {
      // pager = pager !== undefined ? pager : {};
      return res.status(Number(status)).json({
         status,
         message,
         payload
         // pager: pager
         // code
      });
   };

   static checkIfRequired(fieldName): any {
      return 'The ' + fieldName + ' field is required.';
   }

   static generateOTP(length): any {
      // Declare a digits variable
      // which stores all digits
      let digits = '0123456789';
      let OTP = '';

      for (let i = 0; i < length; i++) {
         OTP += digits[Math.floor(Math.random() * 10)];
      }
      return OTP;
   }

   static getEmailHash(email): any {
      let exp = new RegExp('/', 'g');
      let emailHashWithSalt = bcrypt.hashSync(email, '$2b$10$r7tOwjfK42fFGBjhJnpb5O');
      let emailHash = emailHashWithSalt.substring(29).replace(exp, '');
      return emailHash;
   }

   static readHTMLFile(path) {
      return new Promise(async (resolve, reject) => {
         try {
            let html = await readFileSync(path, { encoding: 'utf-8' });
            resolve(html);
         } catch (error) {
            reject(error);
         }
      });
   }

   static async sendEmail(data, options, path) {
      try {
         let emailTemplate = `${BASE_PATH}/../${path}`;
         let text = await Helper.readHTMLFile(emailTemplate);
         let template = hbs.compile(text);
         let htmlToSend = template(options);

         mailer.to = data.email;
         mailer.cc = data.cc;
         mailer.attachments = data.attachments;
         mailer.subject = options['subject'];
         mailer.message = htmlToSend;
         await mailer.sendMail();
         logger.info(`Email sent to ${data.email}`);
         return;
      } catch (error) {
         logger.error(`Error while sending email sent to ${data.email}`);
         throw error;
      }
   }

   static async sendEmailMessage(options) {
      try {
         await mailer.sendMail(options);
         logger.info(`Email sent to ${options.to}`);
         return;
      } catch (error) {
         logger.error(`Error while sending email sent to ${options.to}`);
         throw error;
      }
   }

   /**
    * @description Send Validation Response
    * @param {Object} res
    * @param {errors} errors - Errors Object
    *
    * @return {*|Sequelize.json|Promise<any>}
    */
   static async createValidationResponse(res: Response, errors: any) {
      return Helper.createResponse(res, HttpStatus.UNPROCESSABLE_ENTITY, res['__'](errors[Object.keys(errors)[0]]), {
         error: res['__'](errors[Object.keys(errors)[0]])
      });
   }

   /**
    * @description Send Validation Response
    * @param {Object} res
    * @param {errors} errors - Errors Object
    *
    * @return {*|Sequelize.json|Promise<any>}
    */
   static async createValidationResponseV2(res: Response, errors: any) {
      return Helper.createResponse(res, HttpStatus.UNPROCESSABLE_ENTITY, errors[Object.keys(errors)[0]], {
         error: errors[Object.keys(errors)[0]]
      });
   }

   static createCookie(tokenData) {
      return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
   }

   static returnErrorOrPassToNext(res: Response, next: NextFunction, errors: any) {
      if (Object.keys(errors).length > 0) {
         Helper.createValidationResponse(res, errors);
      } else {
         next();
      }
   }

   static returnErrorOrPassToNextV2(res: Response, next: NextFunction, errors: any) {
      if (Object.keys(errors).length > 0) {
         Helper.createValidationResponseV2(res, errors);
      } else {
         next();
      }
   }

   static safeJSONParser(value, defaultValue = null) {
      try {
         return JSON.parse(value);
      } catch (error) {
         return defaultValue ? defaultValue : value;
      }
   }

   static getWeeklyHours() {
      return [
         { day: 'Monday', isOpen: false, openAt: { hour: 0, minute: 0 }, closeAt: { hour: 23, minute: 59 } },
         { day: 'Tuesday', isOpen: false, openAt: { hour: 0, minute: 0 }, closeAt: { hour: 23, minute: 59 } },
         { day: 'Wednesday', isOpen: false, openAt: { hour: 0, minute: 0 }, closeAt: { hour: 23, minute: 59 } },
         { day: 'Thursday', isOpen: false, openAt: { hour: 0, minute: 0 }, closeAt: { hour: 23, minute: 59 } },
         { day: 'Friday', isOpen: false, openAt: { hour: 0, minute: 0 }, closeAt: { hour: 23, minute: 59 } },
         { day: 'Saturday', isOpen: false, openAt: { hour: 0, minute: 0 }, closeAt: { hour: 23, minute: 59 } },
         { day: 'Sunday', isOpen: false, openAt: { hour: 0, minute: 0 }, closeAt: { hour: 23, minute: 59 } }
      ];
   }

   static randPassword(capitals, numbers, lower, special) {
      var chars = ['ABCDEFGHIJKLMNOPQRSTUVWXYZa', '0123456789', 'abcdefghijklmnopqrstuvwxyz', '!@#$%^&*'];

      return [capitals, numbers, lower, special]
         .map(function (len, i) {
            return Array(len)
               .fill(chars[i])
               .map(function (x) {
                  return x[Math.floor(Math.random() * x.length)];
               })
               .join('');
         })
         .concat()
         .join('')
         .split('')
         .sort(function () {
            return 0.5 - Math.random();
         })
         .join('');
   }

   static randomString(length) {
      var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var result = '';
      for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
      return result;
   }

   static fixDecimalValue(value, decimalPoint = 2) {
      if (isNaN(value)) {
         return value;
      }
      value = +value;
      let _value = value.toFixed(decimalPoint);
      _value = Number(_value);
      return isNaN(_value) ? value : Number(_value);
   }

   static getStringWithSeparator(arr: any[], separator: string = ', ') {
      const myArr = arr.filter((e) => e.value).map((i) => `${i.title || ''}${i.value}`);
      return myArr.join(separator);
   }

   static formatDateString(dateString, format = 'DD-MM-YYYY') {
      return dateString ? moment(dateString).format(format) : '';
   }

}
