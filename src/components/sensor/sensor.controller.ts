import { Helper } from "../../utils/helper";
import { Request, Response } from 'express';
import { Sensor, SensorRecord } from "./model/sensor.model";
import { SensorRawData } from "./model/sensorRaw.model";
import { SensorValueRecord } from "./model/sensorValue.model";
import HttpStatus from 'http-status-codes';

class SensorController {
    /**
       * @typedef getRecentData
       */
    /**
     * API to fetch recent data
     * @route post /api/sensor/recent
     * @group IOT - API for iot
     * @returns {object} 200 - Ok
     * @returns {object} 500 - Internal server error
     */
    public async getRecent(req: Request, res: Response) {
        const sensor = new SensorRecord({
            name: 'test',
            unit: 'test',
            location: 'room'
         })
         await sensor.save()
    }
    /**
       * @typedef getSensorAvg
       */
    /**
     * API to fetch recent average data of sensors present in creche
     * @route post /api/sensor/recent
     * @group IOT - API for iot
     * @returns {object} 200 - Ok
     * @returns {object} 500 - Internal server error
     */
    public async getSensorAvg(req: Request, res: Response) {
        const { sensor_id } = req.params;
        const sensors = [{
            "sensor_id": 112,
            "sensor_name": "Temperature",
            "node_id": "dasdasdqwd",
            "avg_value": 23
        },
        {
            "sensor_id": 114,
            "sensor_name": "Humidity",
            "node_id": "dasdasdqwd",
            "avg_value": 70
        },
        {
            "sensor_id": 131,
            "sensor_name": "CO2",
            "node_id": "dasdasdqwd",
            "avg_value": 131
        },
        {
            "sensor_id": 118,
            "sensor_name": "Brightness",
            "node_id": "dasdasdqwd",
            "avg_value": 45
        }
        ]
        let result = [];
        for(let i = 0; i<sensors.length; i++ ) {
            const sensor = await SensorValueRecord.findOne({ sensorId: sensors[i].sensor_id });
            result.push(sensor);
        } 
        
        // const result = se
    }
    /**
       * @typedef getSensorByLocation
       */
    /**
     * API to fetch recent data of all sensore present in particular location
     * @route post /api/sensor/recent
     * @group IOT - API for iot
     * @returns {object} 200 - Ok
     * @returns {object} 500 - Internal server error
     */
    public async getSensorByLocation(req: Request, res: Response) {
        const { sensor_id } = req.params;
        const sensor = new SensorValueRecord();
        // const result = se
    }
     /**
       * @typedef addData
       */
    /**
     * API to fetch recent data
     * @group IOT - API for iot
     * @returns {object} 200 - Ok
     * @returns {object} 500 - Internal server error
     */
    public async addData(rawObj: SensorRawData) {
        const { sensor_id, data, node_id, source_address, tx_time_ms_epoch} = rawObj
        const sensor = new SensorValueRecord({
            sensorId: sensor_id,
            value: data.lux,
            nodeId: node_id,
            location: source_address,
            date: tx_time_ms_epoch
         })
         await sensor.save()
    }
     /**
       * @typedef addSensor
       */
    /**
     * API to fetch recent data
     * @group IOT - API for iot
     * @returns {object} 200 - Ok
     * @returns {object} 500 - Internal server error
     */
    public async addSensor(req: Request, res: Response) {
        try {
            const reqBody = req.body
            const sensor = new SensorRecord(reqBody);
            await sensor.save()
            Helper.createResponse(res, HttpStatus.OK, 'SENSOR_ADDED', {});
        } catch (err) {
            Helper.createResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'SENSOR_ADDED_ERROR', {});
        }

    }
    
}


export const sensorController = new SensorController();