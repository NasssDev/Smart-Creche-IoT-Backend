import { logger } from "../../utils/logger";
import { SensorValueRecord } from "./model/sensorValue.model";

class SensorHelper {
    /**
    * @description add value
    */
    public async addSensorValue({
        sensor_id, 
        data, 
        node_id, 
        source_address, 
        tx_time_ms_epoch
    }) 
    {
        try {
            const sensorValue = new SensorValueRecord({
                accountId: "64b7d3c5e5929ed0614fb986",
                sensorId: sensor_id,
                value: data.lux,
                nodeId: node_id,
                location: source_address,
                date: tx_time_ms_epoch
              });
              await sensorValue.save();
        } catch (error) {
            logger.error(__filename, {
                method: 'addSensoeValue',
                requestId: '',
                custom_message: 'Error while add value of sensor',
                error
            });
            throw error;
        }
    } 

}

export default new SensorHelper();