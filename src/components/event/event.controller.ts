import { EventRecord } from "./event.model";
import { Helper } from "../../utils/helper";
import HttpStatus from 'http-status-codes';
import { Request, Response } from 'express';
import { logger } from "../../utils/logger";
class EventController {
    public async getEventByAccountId(req: Request, res: Response) {
        try {
            const event = await EventRecord.find({ accountId: req.params.id });
            Helper.createResponse(res, HttpStatus.OK, 'getEventByAccountId',event);
            return;
           } catch (error) {
              logger.error(__filename, {
                 method: 'runDataFetch',
                 requestId: req['uuid'],
                 custom_message: 'Error while finalize runDataFetch',
                 error
              });
              Helper.createResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'getSensorByLocation',error);
              return;
            }
           
            
        }
}

export const eventController = new EventController();