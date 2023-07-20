import { logger } from "../../utils/logger";
import client from "../../utils/mqtt";
import { Sensor, SensorRecord } from "./model/sensor.model";
import { SensorValueRecord } from "./model/sensorValue.model";

class SensorHelper {
    /**
    * @description add value
    */
    static async addSensorValue({
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
    public getData(room,node_id, id_sensor): void {
        // const topic = "groupe8/packet//118";
    
        var room_selected =
          "63c09edc-771b-4e15-ab00-237bb926b040";
    
        switch (room) {
          case "room_1":
            room_selected =
              "63c09edc-771b-4e15-ab00-237bb926b040";
            break;
          case "room_2":
            room_selected = "d9be4235-0aec-40bb-8915-f679a71c890d";
            break;
          default:
            room_selected = "578cf6dc-d4ee-4799-a069-5fe91da86084";
            break;
        }
        const topic = "groupe8/packet/" + room_selected + "/" + node_id+ "/" + id_sensor; 
        SensorHelper.getconnection(topic,node_id);
    
      }
    
      static getconnection(topic: string,node_id: string) {
        client.on("connect", function () {
          console.log("Connected MQTT!");
    
          // Subscribe to the topic
          client.subscribe(topic, function (error) {
            if (error) {
              console.log("Error subscribing to topic:", error);
            } else {
              console.log("Subscribed to topic successfully!");
            }
          });
        });
    
        // Handle MQTT events and messages
        // client.on("message", function (topic, message) {
        //   console.log("Message:", message.toString());
        // });
        client.on("message", async function (topic, message) {
          const messageString = message.toString();
          let _data = JSON.parse(messageString);
            _data.node_id = node_id;
            try {
                // const {
                //     sensor_id, 
                //     datas, 
                //     node_id, 
                //     source_address, 
                //     tx_time_ms_epoch
                // } = data;
            const sensorValue = new SensorValueRecord({
                accountId: "64b7d3c5e5929ed0614fb986",
                sensorId: _data.sensor_id,
                value: _data.data.lux,
                nodeId: _data.node_id,
                location: _data.source_address,
                date: _data.tx_time_ms_epoch
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
            // SensorHelper.addSensorValue(data);
          console.log("Message:", _data);
        });
        client.on("error", function (error) {
          console.log("MQTT error:", error);
        });
    
        client.on("close", function () {
          console.log("MQTT connection closed.");
        });
    }
    public async addSensors(sensor: Sensor) {
        new Promise(async (resolve, reject) => { 
            try {
                const senors = new SensorRecord(sensor);
                await senors.save();
                resolve("ADDED_SENSOR");
            } catch (err) {
                reject(err.toString);
            }
            
        })
      
    }
    public async byLocation(sensor: Sensor) {
        new Promise(async (resolve, reject) => { 
            try {
                const senors = new SensorRecord(sensor);
                await senors.save();
                resolve("ADDED_SENSOR");
            } catch (err) {
                reject(err.toString);
            }
            
        })
      
    }

}

export default new SensorHelper();