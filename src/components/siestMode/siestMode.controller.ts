import { Helper } from "../../utils/helper";
import { logger } from "../../utils/logger";
import HttpStatus from 'http-status-codes';
import siestModeHelper from "./siestMode.helper";
import { Request, Response } from 'express';
import { SiestModeRecord } from "./siestMode.model";
class SiestModeController {
    public async onMode(req: Request, res: Response) { 
        try {
            const { account, user } = req.body;
            await siestModeHelper.onMode();
            const sleepmode = new SiestModeRecord({
                accountId: account._id,
                start: new Date(),
                end: null,
            });
            await sleepmode.save();
            console.log("ENDED")
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
            const { account, user } = req.body;
            const thisSleepMode = await SiestModeRecord.findOne({ accountId: account, end: null });
            if (thisSleepMode) {
                await SiestModeRecord.updateOne({ _id: thisSleepMode._id }, { $set: { end: new Date() } });
                await siestModeHelper.offMode();
            }
            
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