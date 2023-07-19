import { Helper } from "../../utils/helper";
import HttpStatus from 'http-status-codes';
import { logger } from "../../utils/logger";
import { RoleRecord } from "../role/role.model";


class UserRoleController {
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
   public async getroles(req: Request, res: Response) {
    try {  
       const roles = await RoleRecord.find().lean()
       Helper.createResponse(res, HttpStatus.OK, 'FETCH_PROFIL_SUCCESS', {roles});
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
}

export const userRoleController = new UserRoleController();