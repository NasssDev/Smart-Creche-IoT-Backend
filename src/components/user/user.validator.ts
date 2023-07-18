import { NextFunction, Request, Response } from 'express';
import axios from "axios";
import { isEmail, isEmpty, validatePassword } from '../../utils/validator';
import { Helper } from '../../utils/helper';
import { AccountRecord } from '../account/account.model';
import { UserRecord } from './user.model';

class UserValidator {
    /**
    * signup request payload validation
    *
    * @param req - The request object
    * @param res - The response object
    * @param next - The next middleware function
    */
    public async signupValidator(req: Request, res: Response, next: NextFunction) {
    const { email, firstName, lastName, positionHeld, siret, password } = req.body;

    const errors = {}

    //check siret
    if(isEmpty(siret)){
        errors['siret'] = 'SIRET_NOT_FOUND'
    }
    try {  
        const isExist = await AccountRecord.findOne({siret, isDeleted: false}).lean()  
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
        errors['firstName'] = 'FIRsTNAME_NOT_FOUND'
    }
    req.body.firstName = firstName.toLowerCase()

    //check lastName
    if(isEmpty(lastName)){
        errors['lastName'] = 'LASTNAME_NOT_FOUND'
    }
    req.body.lastName = lastName.toLowerCase()

    //check email
    const _isExist = await UserRecord.findOne({email, isDeleted: false}).lean()  
    if(!isEmpty(_isExist)){
        errors['siret'] = 'SIRET_ALREADY_EXIST';
    }  
    if(isEmpty(email)){
        errors['email'] = 'EMAIL_NOT_FOUND'
    }else if (!isEmail(email)) {
        errors['email'] = 'INVALID_EMAIL';
    }
    req.body.email = email.toLowerCase()

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

   /**
    * signin request payload validation
    *
    * @param req - The request object
    * @param res - The response object
    * @param next - The next middleware function
    */
    public async signinValidator(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;

        const errors = {}

        //check email
        if(isEmpty(email)){
            errors['email'] = 'EMAIL_NOT_FOUND'
        }else if (!isEmail(email)) {
            errors['email'] = 'INVALID_EMAIL';
        }
        req.body.email = email.toLowerCase()

        try{
            const user : any = await UserRecord.findOne({ email, isDeleted: false }).lean();
            if (isEmpty(user)){
                errors['email'] = 'EMAIL_AND_PASSWORD_DOESENT_MATCH';
            }
            req.body.user = user
        }catch(err){
            errors['email'] = 'EMAIL_ERROR';
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