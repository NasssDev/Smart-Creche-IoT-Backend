import { Helper } from "../../utils/helper";
import HttpStatus from 'http-status-codes';
import { logger } from "../../utils/logger";
import { Request, Response } from 'express';
import axios from "axios";


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

        const siretCheck = await axios({
            url: `https://api.insee.fr/entreprises/sirene/V3/siret/${siret}`,
            method: 'get',
            headers: { Authorization: `Bearer ${process.env.INSEE_TOKEN}` }
         });

         //console.log(siretCheck);
         
       Helper.createResponse(res, HttpStatus.OK, 'SIGNUP_SUCCESS', { siretCheck });
       return siretCheck;
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