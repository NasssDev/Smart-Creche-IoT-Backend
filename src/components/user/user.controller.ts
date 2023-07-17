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
         password: encryptedPassword,
         createdAt: new Date(),
         updatedAt: new Date()
      });
      await user.save();

      // configure account
      const _address = {
         address: siret?.etablissement?.adresseEtablissement?.numeroVoieEtablissement + ' ' + siret?.etablissement?.adresseEtablissement?.typeVoieEtablissement + ' ' + siret?.etablissement?.adresseEtablissement?.libelleVoieEtablissement,
         optional: siret?.etablissement?.adresseEtablissement?.complementAdresseEtablissement,
         postalCode: siret?.etablissement?.adresseEtablissement?.codePostalEtablissement,
         city: siret?.etablissement?.adresseEtablissement?.libelleCommuneEtablissement,
         coutryId: '64b51f9dd896af49cde3843e'
      }

      const account = new AccountRecord({
         name: siret?.etablissement?.uniteLegale?.denominationUniteLegale,
         siret: siret?.etablissement?.siret,
         type: siret?.etablissement?.uniteLegale?.activitePrincipaleUniteLegale === '88.91A' ? '88.91A - Accueil de jeunes enfants' : null,
         address: _address || null,
         email: user?._id,
         phone: null,
         createdAt: new Date(),
         updatedAt: new Date(),
      });
      await account.save();

      // configure userRole
      const userRole = new UserRoleRecord({
         userId: user?._id,
         accountId: account?._id,
         roleId: '64b5562ed896af49cde3843f',
         updatedAt: new Date()
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

}

export const userController = new UserController();