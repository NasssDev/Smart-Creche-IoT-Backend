import { Helper } from "../../utils/helper";
import { logger } from "../../utils/logger";
import HttpStatus from 'http-status-codes';
import siestModeHelper from "./siestMode.helper";
class SiestModeController {
    public async onMode(req: Request, res: Response) { 
        try {
            const result = siestModeHelper.onMode();
            Helper.createResponse(res, HttpStatus.OK, 'SLEEP_MODE_ON',{});
          return;
        } catch (err) {
            logger.error(__filename, {
                method: 'runDataFetch',
                requestId: req['uuid'],
                custom_message: 'Error while finalize runDataFetch',
                err
             });
             Helper.createResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'RAN DATA_ERRRO', {});
             return;
        }
    }
    public async offMode(req: Request, res: Response) { 
        try {
            const result = siestModeHelper.offMode();
            Helper.createResponse(res, HttpStatus.OK, 'SLEEP_MODE_OFF',{});
          return;
        } catch (err) {
            logger.error(__filename, {
                method: 'runDataFetch',
                requestId: req['uuid'],
                custom_message: 'Error while finalize runDataFetch',
                err
             });
             Helper.createResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'RAN DATA_ERRRO', {});
             return;
        }
    }
}

export const siestModeController = new SiestModeController();