import { Constants } from "../../utils/constants";
import client from "../../utils/mqtt";
import { NodeSensorRecord } from "../sensor/model/nodeSensor.model";
import { SensorValueRecord } from "../sensor/model/sensorValue.model";
import { EventRecord } from "./event.model";
    
class EventModeHelper { 
    static offAc(location, node_id) { 
        new Promise(async(resolve, reject) => {
            
            try {
                const sensor = await SensorValueRecord.findOne({ sensorId: Constants.SENSORS.AC, location });
                if (sensor.value.value == 1) {
                    console.log("OFF_AC");
                    // client.on("connect", function () {
                    const topic = "groupe8/request/" + location;
                    const message = {
                        "cmd_id": 102,
                        "destination_address": node_id,
                        "ack_flags": 0,
                        "cmd_type": 204
                    };
                    await EventModeHelper.addEvent("AC", "AC OFF");
                    await client.publish(topic, JSON.stringify(message));
                }
                resolve(true);
        } catch (err) {
            reject(err);
        }
            });
        return true
    }
    static onAC(location, node_id) { 
        new Promise(async(resolve, reject) => {
           
            try {
            // client.on("connect", function () {
                const sensor = await SensorValueRecord.findOne({ sensorId: Constants.SENSORS.AC, location});
                if (sensor.value.value == 0) {
                    console.log("ON_AC");
                    const topic = "groupe8/request/" + location;
                    const message = {
                        "cmd_id": 102,
                        "destination_address": node_id,
                        "ack_flags": 0,
                        "cmd_type": 203
                    };
                    await client.publish(topic, JSON.stringify(message));
                    await EventModeHelper.addEvent("AC", "AC ON");
                }
                resolve(true);
        } catch (err) {
            reject(err);
        }
            });
        return true
    }
    static onHeater(location, node_id) { 
        new Promise(async(resolve, reject) => {
            
            try {
                const sensor = await SensorValueRecord.findOne({ sensorId: Constants.SENSORS.HEATER, location});
                if (sensor.value.value == 0) {
                    console.log("ON_Heater");
                    // client.on("connect", function () {
                    const topic = "groupe8/request/" + location;
                    const message = {
                        "cmd_id": 101,
                        "destination_address": node_id,
                        "ack_flags": 0,
                        "cmd_type": 201
                    };
                    await client.publish(topic, JSON.stringify(message));
                    await EventModeHelper.addEvent("Heater", "Heater ON");
                }
                resolve(true);
        } catch (err) {
            reject(err);
        }
            });
        return true
    }
    static  offHeater(location, node_id) { 
        new Promise(async(resolve, reject) => {
            try {
            // client.on("connect", function () {
                const sensor = await SensorValueRecord.findOne({ sensorId: Constants.SENSORS.HEATER, location});
                if (sensor.value.value == 1) {
                    console.log("OFF_Heater");
                    const topic = "groupe8/request/" + location;
                    const message = {
                        "cmd_id": 101,
                        "destination_address": node_id,
                        "ack_flags": 0,
                        "cmd_type": 202
                    };
                    await client.publish(topic, JSON.stringify(message));
                    await EventModeHelper.addEvent("Heater", "Heater OFF");
                }
                resolve(true);
        } catch (err) {
            reject(err);
        }
            });
        return true
    }
    static onVentilator(location, node_id) { 
        new Promise(async(resolve, reject) => {
           
            try {
            // client.on("connect", function () {
                const sensor = await SensorValueRecord.findOne({ sensorId: Constants.SENSORS.VENT, location});
                if (sensor.value.value == 0) {
                    console.log("ON_VENT");
                    const topic = "groupe8/request/" + location;
                    const message = {
                        "cmd_id": 103,
                        "destination_address": node_id,
                        "ack_flags": 0,
                        "cmd_type": 205
                    };
                    await client.publish(topic, JSON.stringify(message));
                    await EventModeHelper.addEvent("Ventilator", "Ventilator ON");
                }

                resolve(true);
        } catch (err) {
            reject(err);
        }
            });
        return true
    }
    static offVentilator(location, node_id) { 
        new Promise(async(resolve, reject) => {
            try {
            // client.on("connect", function () {
                const sensor = await SensorValueRecord.findOne({ sensorId: Constants.SENSORS.VENT, location});
                if (sensor.value.value == 1) {
                    console.log("OFF_VENT");
                    const topic = "groupe8/request/" + location;
                    const message = {
                        "cmd_id": 103,
                        "destination_address": node_id,
                        "ack_flags": 0,
                        "cmd_type": 206
                    };
                    await client.publish(topic, JSON.stringify(message));
                    await EventModeHelper.addEvent("Ventilator", "Ventilator OFF");
                }
                resolve(true);
        } catch (err) {
            reject(err);
        }
            });
        return true
    }
    public async valueLimit(sensorId: string, source_address: string, value: number) { 
        const valueObj = {
            "112": [19, 25],
            "131": [400, 800],
        }
        const valueList = valueObj[sensorId];
        if (sensorId == Constants.SENSORS.TEMPERATURE.toString()) {
            if (value < valueList[0]) await EventModeHelper.onLimitHeater(sensorId, source_address);
            else if (value > valueList[1]) await EventModeHelper.onLimitAc(sensorId, source_address);
            else await EventModeHelper.offAcHeater(sensorId, source_address)// on ac
        }
        if (sensorId == Constants.SENSORS.CO2.toString()) {
            if (value < valueList[0]) await EventModeHelper.offVentilatorLimit(sensorId, source_address);
            if (value > valueList[1]) await EventModeHelper.onVentilatorLimit(sensorId, source_address);
        }
        
        return true
    }
    static async onLimitHeater(sensorId: string, roomId: string) { 
        try {
   
            const nodesensorHeater = await NodeSensorRecord.findOne({ sensorId: Constants.SENSORS.HEATER , roomId }).lean();
            const nodesensorAc = await NodeSensorRecord.findOne({ sensorId: Constants.SENSORS.AC , roomId }).lean();
            await EventModeHelper.offAc(roomId, nodesensorAc.nodeId);
            await EventModeHelper.onHeater(roomId, nodesensorHeater.nodeId);
            return true;
        }
        catch(err) {
            throw err;
        }
    }
    static async onLimitAc(sensorId: string, roomId: string) { 
        try {
            const nodesensorHeater = await NodeSensorRecord.findOne({ sensorId: Constants.SENSORS.HEATER , roomId }).lean();
            const nodesensorAc = await NodeSensorRecord.findOne({ sensorId: Constants.SENSORS.AC , roomId }).lean();
            await EventModeHelper.onAC(roomId, nodesensorAc.nodeId);
            await EventModeHelper.offHeater(roomId, nodesensorHeater.nodeId);
            return true;
        }
        catch(err) {
            throw err;
        }
    }
    static async offAcHeater(sensorId: string, roomId: string) { 
        try {
            const nodesensorHeater = await NodeSensorRecord.findOne({ sensorId: Constants.SENSORS.HEATER , roomId }).lean();
            const nodesensorAc = await NodeSensorRecord.findOne({ sensorId: Constants.SENSORS.AC , roomId }).lean();
            await EventModeHelper.offAc(roomId, nodesensorAc.nodeId);
            await EventModeHelper.offHeater(roomId, nodesensorHeater.nodeId);
            return true;
        }
        catch(err) {
            throw err;
        }
    }
    static async on(sensorId: string, roomId: string) { 
        try {
            const nodesensor = await NodeSensorRecord.findOne({ sensorId, roomId }).lean();
            await EventModeHelper.offAc(roomId, nodesensor.nodeId);
            await EventModeHelper.onHeater(roomId, nodesensor.nodeId);
            return true;
        }
        catch(err) {
            throw err;
        }
    }
    //////
    static async offVentilatorLimit(sensorId: string, roomId: string) { 
        try {
            const nodesensor = await NodeSensorRecord.findOne({ sensorId: Constants.SENSORS.VENT, roomId }).lean();
            await EventModeHelper.offVentilator(roomId, nodesensor.nodeId);
            return true;
        }
        catch(err) {
            throw err;
        }
    }
    static async onVentilatorLimit(sensorId: string, roomId: string) { 
        try {
            const nodesensor = await NodeSensorRecord.findOne({  sensorId: Constants.SENSORS.VENT, roomId }).lean();
            await EventModeHelper.onVentilator(roomId, nodesensor.nodeId);
            return true;
        }
        catch(err) {
            throw err;
        }
    }
    static async addEvent(sensor_name: string, action: string) { 
        try {
            const event = new EventRecord({
                sensor: sensor_name,
                accountId: "64b82716c3836bc749487d3b",
                action
            });
            await event.save();
            return true;
        }
        catch(err) {
            throw err;
        }
    }
}
export default new EventModeHelper();