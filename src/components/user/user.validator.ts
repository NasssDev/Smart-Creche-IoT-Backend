import { NextFunction, Request, Response } from 'express';
import axios from "axios";
import { isEmail, isEmpty, validatePassword } from '../../utils/validator';
import { Helper } from '../../utils/helper';
import { AccountRecord } from '../account/account.model';

class UserValidator {
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
   public async signupValidator(req: Request, res: Response, next: NextFunction) {
    const { email, firstName, lastName, positionHeld, siret, password } = req.body;

    const errors = {}

    //check siret
    if(isEmpty(siret)){
        errors['siret'] = 'SIRET_NOT_FOUND'
    }
    try {  
        const isExist = await AccountRecord.findOne({siret}).lean()  
        if(!isEmpty(isExist)){
            errors['siret'] = 'SIRET_ALREADY_EXIST';
        }  
        const siretCheck = await axios({
            url: `https://api.insee.fr/entreprises/sirene/V3/siret/${siret}`,
            method: 'get',
            headers: { Authorization: `Bearer ${process.env.INSEE_TOKEN}` }
         });
         const data = siretCheck?.data        
         
         if(isEmpty(data)){
            errors['siret'] = 'INVALID_SIRET';
         }else if(data?.etablissement?.uniteLegale?.activitePrincipaleUniteLegale != "88.91A"){
            errors['siret'] = 'WRONG_SIRET';
         }
         req.body.siret = data
         
    } catch (error) {
        errors['siret'] = 'SIRET_ERROR';
    }

    //check firstName
    if(isEmpty(firstName)){
        errors['fisrtName'] = 'FISRTNAME_NOT_FOUND'
    }

    //check lastName
    if(isEmpty(lastName)){
        errors['lastName'] = 'LASTNAME_NOT_FOUND'
    }

    //check email
    if(isEmpty(email)){
        errors['email'] = 'EMAIL_NOT_FOUND'
    }else if (!isEmail(email)) {
        errors['email'] = 'INVALID_EMAIL';
     }

    //check position held
    if(isEmpty(positionHeld)){
        errors['positionHeld'] = 'POSITIONHELD_NOT_FOUND'
    }

    //password
    if(isEmpty(password)){
        errors['password'] = 'PASSWORD_NOT_FOUND'
    }else if (!validatePassword(password)) {
        errors['password'] = 'INVALID_PASSWORD';
     }

    Helper.returnErrorOrPassToNext(res, next, errors);
 }
}
export default new UserValidator();