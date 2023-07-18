import { Helper } from "../../utils/helper";
import HttpStatus from 'http-status-codes';
import { logger } from "../../utils/logger";
import { Request, Response } from 'express';
import axios from "axios";
import { UserRecord } from "./user.model";
import { AccountRecord } from "../account/account.model";
import * as bcrypt from 'bcrypt';
import { Constants } from "../../utils/constants";
import { UserRoleRecord } from "../userRole/userRole.model";
import { Common } from "../common";
import userHelper from "./user.helper";
import { SessionRecord } from "../session/session.model";



class UserController {

   /**
    * @typedef signup
    */
   /**
    * API to  reate an account
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

         const account = new AccountRecord({
            name: siret?.etablissement?.uniteLegale?.denominationUniteLegale,
            siret: siret?.etablissement?.siret,
            type: siret?.etablissement?.uniteLegale?.activitePrincipaleUniteLegale === '88.91A' ? '88.91A - Accueil de jeunes enfants' : null,
            address: _address || null,
            email: null,
            phone: null,
            updatedBy: user?._id
         });
         await account.save();

         // configure userRole
         const userRole = new UserRoleRecord({
            userId: user?._id,
            accountId: account?._id,
            roleId: process.env.MANAGER_ROLE_ID,
            defaultLoginAccount: true
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
    * API to  reate an account
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
              
         if (isPwdMatching) {  
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

}

export const userController = new UserController();