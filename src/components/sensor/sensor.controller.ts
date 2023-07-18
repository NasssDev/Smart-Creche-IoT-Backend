import { SensorRecord } from "./model/sensor.model";
import { SensorRawData } from "./model/sensorRaw.model";

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
       * @typedef addData
       */
    /**
     * API to fetch recent data
     * @group IOT - API for iot
     * @returns {object} 200 - Ok
     * @returns {object} 500 - Internal server error
     */
    public async addData(rawObj: SensorRawData) {
        const { sensor_id, data, source_address, tx_time_ms_epoch} = rawObj
        const sensor = new SensorRecord({
            name: sensor_id,
            unit: data.lux,
            location: source_address,
            timestamp: tx_time_ms_epoch
         })
         await sensor.save()
    }
}

export const sensorController = new SensorController();