import { Helper } from "../../utils/helper";
import client from "../../utils/mqtt";
import HttpStatus from 'http-status-codes';
import { CountryRecord } from "../country/country.model";
import { SensorRawData } from "./model/sensorRaw.model";
import { SensorValueRecord } from "./model/sensorValue.model";
// import sensorHelper from "./sensor.helper";
import { Request, Response } from 'express';
import { logger } from "../../utils/logger";

export default class SensorController {
    
    /**
       * @typedef addData
       */
    /**
     * API to fetch recent data
     * @group IOT - API for iot
     * @returns {object} 200 - Ok
     * @returns {object} 500 - Internal server error
     */
  // public async runDataFetch(req: Request, res: Response) {
  //   console.log("Sdsa");
  //   try {
  //        sensorHelper.getData("room_1", "0519adec-dcf7-40f2-a73d-3ca7cb3a3dcd", 118);
  //         Helper.createResponse(res, HttpStatus.OK, 'RAN DATA FETCH',{});
  //         return;
  //      } catch (error) {
  //         logger.error(__filename, {
  //            method: 'runDataFetch',
  //            requestId: req['uuid'],
  //            custom_message: 'Error while finalize runDataFetch',
  //            error
  //         });
  //         Helper.createResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'RAN DATA_ERRRO', {});
  //         return;
  //       }
       
        
  //   }
//   public async addSensor(req: Request, res: Response) {
//     try {
//           await sensorHelper.addSensors(req.body);
//           Helper.createResponse(res, HttpStatus.OK, 'RAN DATA FETCH',{});
//           return;
//        } catch (error) {
//           logger.error(__filename, {
//              method: 'runDataFetch',
//              requestId: req['uuid'],
//              custom_message: 'Error while finalize runDataFetch',
//              error
//           });
//           Helper.createResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'RAN DATA_ERRRO', {});
//           return;
//         }
       
        
//     }
  public async getSensorByLocation(req: Request, res: Response) {
    try {
      const {location} =req.params
      let locationString = location
      let resultList = [];
      const sensors = await SensorValueRecord.aggregate([
         { $sort: { createdAt: -1 } },
         {
             $group: {
                 _id: { location: "$location", sensorId: "$sensorId" }, sensorvalues: { $push: "$value" }

             }
         },
         { $project: { sensorvalues: { $slice: ["$sensorvalues", 1] } } }
      ]);
      let _sensorList = sensors.filter((ele) => ele["_id"].location == locationString);
      _sensorList.forEach((ele) => {
        resultList.push({
          sensor_id: ele["_id"]["sensorId"],
          location: ele["_id"]["location"],
          sensor_name: "as",
          values: ele["sensorvalues"]
        })
      })
          Helper.createResponse(res, HttpStatus.OK, 'getSensorByLocation',resultList);
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
  public async getSensorValAvg(req: Request, res: Response) {
    try {
      const sensors = await SensorValueRecord.aggregate([
        { $sort: { createdAt: -1 } },
        {
            $group: {
                _id: { location: "$location", sensorId: "$sensorId" }, sensorvalues: { $push: "$value" }

            }
        },
        { $project: { sensorvalues: { $slice: ["$sensorvalues", 1] } } }
      ]);
      let count = 0;
      let totalValue = 0;
      sensors.forEach((ele,) => {
        if (ele["_id"].sensorId == req.params.id) {
          if (ele["sensorvalues"].length > 0) {
            count++;
            const valObj = ele["sensorvalues"][0];
            const skey = Object.keys(valObj);
            totalValue += valObj[skey[1]];
          }
          
        }
      })
      console.log(count);
      const average = totalValue / count;
      Helper.createResponse(res, HttpStatus.OK, 'RAN DATA FETCH', { average });
       } catch (error) {
          logger.error(__filename, {
             method: 'runDataFetch',
             requestId: req['uuid'],
             custom_message: 'Error while finalize runDataFetch',
             error
          });
          Helper.createResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'RAN DATA_ERRRO', {error});
          return;
        }
       
        
    }
//   public async addSensor(req: Request, res: Response) {
//     try {
//           await sensorHelper.addSensors(req.body);
//           Helper.createResponse(res, HttpStatus.OK, 'RAN DATA FETCH',{});
//           return;
//        } catch (error) {
//           logger.error(__filename, {
//              method: 'runDataFetch',
//              requestId: req['uuid'],
//              custom_message: 'Error while finalize runDataFetch',
//              error
//           });
//           Helper.createResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'RAN DATA_ERRRO', {});
//           return;
//         }
       
        
//     }
}




export const sensorController = new SensorController();
