import { Helper } from "../../utils/helper";
import HttpStatus from 'http-status-codes';
import { logger } from "../../utils/logger";
import { Request, Response } from 'express';
import { UserRecord } from "./user.model";
import { AccountRecord } from "../account/account.model";
import * as bcrypt from 'bcrypt';
import { Constants } from "../../utils/constants";
import { UserRoleRecord } from "../userRole/userRole.model";
import { Common } from "../common";
import { SessionRecord } from "../session/session.model";
import { isEmpty } from "../../utils/validator";
import { redisService } from "../../utils/redis";
import { NodeSensorRecord } from "../sensor/model/nodeSensor.model";
import { RoleRecord } from "../role/role.model";



class UserController {

   /**
    * @typedef signup
    */
   /**
    * API to create an account
    * @route post /api/signup
    * @group IOT - API for iot
    * @returns {object} 200 - Ok
    * @returns {object} 500 - Internal server error
    */
   public async signup(req: Request, res: Response) {
      const { email, firstName, lastName, positionHeld, siret, password } = req.body;
      try {   

         // configure user
         const encryptedPassword = await bcrypt.hash(password, Constants.PASSWORD.SALT_ROUND);
         const user = new UserRecord({
            lastName,
            firstName,
            email,
            password: encryptedPassword
         });
         await user.save();

         // configure account
         const _address = {
            address: siret?.etablissement?.adresseEtablissement?.numeroVoieEtablissement + ' ' + siret?.etablissement?.adresseEtablissement?.typeVoieEtablissement + ' ' + siret?.etablissement?.adresseEtablissement?.libelleVoieEtablissement,
            optional: siret?.etablissement?.adresseEtablissement?.complementAdresseEtablissement,
            postalCode: siret?.etablissement?.adresseEtablissement?.codePostalEtablissement,
            city: siret?.etablissement?.adresseEtablissement?.libelleCommuneEtablissement,
            coutryId: process.env.COUNTRY_ID
         }

         const livingRoomSensor = await NodeSensorRecord.find({roomId:'d9be4235-0aec-40bb-8915-f679a71c890d' }).lean()
         const bedRoom = await NodeSensorRecord.find({roomId:'63c09edc-771b-4e15-ab00-237bb926b040' }).lean()
         const bathRoom = await NodeSensorRecord.find({roomId:'578cf6dc-d4ee-4799-a069-5fe91da86084' }).lean()
         const roomList = [
            {
               name: 'Living Room',
               roomId: 'd9be4235-0aec-40bb-8915-f679a71c890d',
               area: 50,
               sensors: livingRoomSensor
            },
            {
               name: 'Bed Room',
               roomId: '63c09edc-771b-4e15-ab00-237bb926b040',
               area: 20,
               sensors: bedRoom
            },
            {
               name: 'Bath Room',
               roomId: '578cf6dc-d4ee-4799-a069-5fe91da86084',
               area: 10,
               sensors: bathRoom
            }
         ]

         const account = new AccountRecord({
            name: siret?.etablissement?.uniteLegale?.denominationUniteLegale,
            siret: siret?.etablissement?.siret,
            type: siret?.etablissement?.uniteLegale?.activitePrincipaleUniteLegale === '88.91A' ? '88.91A - Accueil de jeunes enfants' : null,
            address: _address || null,
            roomList,
            email: null,
            phone: null,
            updatedBy: user?._id
         });
         await account.save();

         // configure userRole
         const notifications = {
            mouvement: true,
            temperature: true,
            co2: true,
            humidity: true,
            noise: true,
            waterLeak: true
         }
         const userRole = new UserRoleRecord({
            userId: user?._id,
            accountId: account?._id,
            roleId: process.env.MANAGER_ROLE_ID,
            defaultLoginAccount: true,
            notifications
         });
         await userRole.save();
            
         Helper.createResponse(res, HttpStatus.OK, 'SIGNUP_SUCCESS', { account, user, userRole });
         return;
      } catch (error) {
         logger.error(__filename, {
            method: 'signup',
            requestId: req['uuid'],
            custom_message: 'Error while finalize signup',
            error
         });
         Helper.createResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'SIGNUP_ERROR', {});
         return;
      }
   }

   /**
    * @typedef signin
    */
   /**
    * API to signin
    * @route post /api/signin
    * @group IOT - API for iot
    * @returns {object} 200 - Ok
    * @returns {object} 500 - Internal server error
    */
   public async signin(req: Request, res: Response) {
      const { password, user } = req.body;
      try {   
         const userRole = await UserRoleRecord.findOne({userId: user._id, defaultLoginAccount: true, isDeleted: false}).lean()
         const account = await AccountRecord.findOne({_id: userRole.accountId, isDeleted: false}).lean()
         const isPwdMatching = await bcrypt.compare(password, user.password);           
              
         if (isPwdMatching && !user.resetPassword) {  
           const session = await SessionRecord.create({
               userId: user._id,
               accountId: account._id
            });
            const tokenData = Common.createToken({ user, userRole, session: session });    
            res.setHeader('Set-Cookie', [Helper.createCookie(tokenData)]);          
            Helper.createResponse(res, HttpStatus.OK, 'SIGNIN_SUCCESS', {
               user,
               token: tokenData?.token,
               account
            });
            return 
         }
         Helper.createResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'EMAIL_AND_PASSWORD_DOESENT_MATCH', {});
         return;
      } catch (error) {
         logger.error(__filename, {
            method: 'signin',
            requestId: req['uuid'],
            custom_message: 'Error while finalize signin',
            error
         });
         Helper.createResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'SIGNIN_ERROR', {});
         return;
      }
   }

   /**
    * @typedef password
    */
   /**
    * API to reset password
    * @route post /api/password/1
    * @group IOT - API for iot
    * @returns {object} 200 - Ok
    * @returns {object} 500 - Internal server error
    */
   public async resetPassword(req: Request, res: Response) {
      const { email, confirmEmail, user } = req.body;
      try {             
         if (!isEmpty(user) && confirmEmail === email) {  
            await UserRecord.updateOne({_id: user._id}, {$set: {resetPassword: true, resetPasswordStep: 1}});
            const otp = Helper.generateOTP(6);
            try {
               await redisService.redisSetValue(email, JSON.stringify({ otp }), Constants.TTL);
            } catch (error) {
               logger.error(__filename, {
                  method: 'verifyEmail',
                  requestId: req['uuid'],
                  custom_message: 'Error while storing otp in cache',
                  error
               });
            }

            // let emailOptions = { otp, name: `Test`, subject: 'OTP VERIFICATION - IOT' };
            // try {
            //    await Helper.sendEmail({ email }, emailOptions, '../../views/email-verification.hbs');
            // } catch (error) {
            //    logger.error(__filename, {
            //       method: 'verifyEmail',
            //       requestId: req['uuid'],
            //       custom_message: 'Error while sending otp',
            //       error
            //    });
            // }
            Helper.createResponse(res, HttpStatus.OK, 'RESET_PWD_STEP1_SUCCESS', {otp});
            return 
         }
         Helper.createResponse(res, HttpStatus.NOT_FOUND, 'RESET_PWD_STEP1_ERROR', {});
         return;
      } catch (error) {
         logger.error(__filename, {
            method: 'signin',
            requestId: req['uuid'],
            custom_message: 'Error while check email in reset password process',
            error
         });
         Helper.createResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'RESET_PWD_STEP1_ERROR', {});
         return;
      }
   }

   /**
    * @typedef password
    */
   /**
    * API to reset password
    * @route post /api/password/2
    * @group IOT - API for iot
    * @returns {object} 200 - Ok
    * @returns {object} 500 - Internal server error
    */
   public async checkOtp(req: Request, res: Response) {
      const { otp, user, email} = req.body;
      try {
         if (!isEmpty(user) && user.resetPassword && user.resetPasswordStep === 1 ){
            const otpData = (await redisService.redisGetValue(email)) || {};            
            if (!isEmpty(otpData) && otpData['status'] === 'verified') {              
               logger.error(__filename, {
               method: 'verifyOTP',
               requestId: req['uuid'],
               custom_message: 'Given otp does not match for verification process'
               });
               Helper.createResponse(res, HttpStatus.OK, 'OTP_EXPIRED', { isValidOTP: false });
               return;
            }
            if (!isEmpty(otpData) && otpData['otp'].toString() === otp.toString()) {
               const userRole = await UserRoleRecord.findOne({userId: user._id, defaultLoginAccount: true, isDeleted: false}).lean()
               await UserRecord.updateOne({_id: user._id}, {$set: {resetPasswordStep: 2}});
               await redisService.redisSetValue(email, JSON.stringify({ otp, status: 'verified' }), Constants.TTL);
               const tokenData = Common.createToken({ user: user, userRole: userRole });
               res.setHeader('Set-Cookie', [Helper.createCookie(tokenData)]);
               return Helper.createResponse(res, HttpStatus.OK, 'OTP_VERIFIED', {
               isValidOTP: true,
               user,
               token: tokenData?.token
               });
            }       
         }
         Helper.createResponse(res, HttpStatus.NOT_FOUND, 'RESET_PWD_STEP2_ERROR', {});
         return;  
      } catch (error) {
         logger.error(__filename, {
            method: 'signin',
            requestId: req['uuid'],
            custom_message: 'Error while check otp in reset password process',
            error
         });
         Helper.createResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'RESET_PWD_STEP2_ERROR', {});
         return;
      }
   }

   /**
    * @typedef password
    */
   /**
    * API to reset password
    * @route post /api/password/3
    * @group IOT - API for iot
    * @returns {object} 200 - Ok
    * @returns {object} 500 - Internal server error
    */
   public async changePassword(req: Request, res: Response) {
      const { password, confirmPassword, user } = req.body;
      try {  
         if (!isEmpty(user) && user.resetPassword && user.resetPasswordStep === 2 ){
            if (password === confirmPassword) {  
               const encryptedPassword = await bcrypt.hash(password, Constants.PASSWORD.SALT_ROUND);
               await UserRecord.updateOne({_id: user._id}, {$set: {password: encryptedPassword, resetPasswordStep: 3, resetPassword: false}})
               Helper.createResponse(res, HttpStatus.OK, 'RESET_PWD_STEP3_SUCCESS', {});
               return 
            }
         }
         Helper.createResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'RESET_PWD_STEP3_ERROR', {});
         return;
      } catch (error) {
         logger.error(__filename, {
            method: 'signin',
            requestId: req['uuid'],
            custom_message: 'Error while change password in reset password process',
            error
         });
         Helper.createResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'RESET_PWD_STEP3_ERROR', {});
         return;
      }
   }

   /**
    * @typedef profil
    */
   /**
    * API to fetch user profil
    * @route post /api/profil
    * @group IOT - API for iot
    * @returns {object} 200 - Ok
    * @returns {object} 500 - Internal server error
    */
   public async getProfil(req: Request, res: Response) {
      const { user, account } = req.body;
      try {  
         const profil = {
            account: await AccountRecord.findOne({_id: account._id}).lean(),
            user: await UserRecord.findOne({_id: user._id}).lean(),
            userRole: await UserRoleRecord.findOne({accountId: account._id, userId: user._id}).lean()
         }
         Helper.createResponse(res, HttpStatus.OK, 'FETCH_PROFIL_SUCCESS', {profil});
            return 
      } catch (error) {
         logger.error(__filename, {
            method: 'getProfil',
            requestId: req['uuid'],
            custom_message: 'Error while fetch user profil',
            error
         });
         Helper.createResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'FETCH_PROFIL_ERROR', {});
         return;
      }
   }

   /**
    * @typedef profil
    */
   /**
    * API to fetch user profil
    * @route post /api/profil
    * @group IOT - API for iot
    * @returns {object} 200 - Ok
    * @returns {object} 500 - Internal server error
    */
   public async updateProfil(req: Request, res: Response) {
      const { user, account, notifications, email, positionHeld, firstName, lastName } = req.body;
      try {  

         await UserRecord.updateOne({_id: user._id}, {$set: {email, firstName, lastName}});
         const session = await SessionRecord.create({
            userId: user._id,
            accountId: account._id
         });

         const role = await RoleRecord.findOne({type: positionHeld}).lean()
         const userRole =  await UserRoleRecord.findOne({userId: user._id, accountId: account._id}).lean()

         await UserRoleRecord.updateOne({_id: role._id}, {$set: { notifications, roleId: role._id }})

         const tokenData = Common.createToken({ user, userRole, session: session });    
         res.setHeader('Set-Cookie', [Helper.createCookie(tokenData)]);

         Helper.createResponse(res, HttpStatus.OK, 'UPDATE_PROFIL_SUCCESS', {
            token: tokenData.token,
            account: account,
            user: user,
            role: role,
            userRole: userRole
         });
         return 
      } catch (error) {
         logger.error(__filename, {
            method: 'putProfil',
            requestId: req['uuid'],
            custom_message: 'Error while update user profil',
            error
         });
         Helper.createResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'UPDATE_PROFIL_ERROR', {});
         return;
      }
   }

}

export const userController = new UserController();