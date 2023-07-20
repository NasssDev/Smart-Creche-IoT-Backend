import { logger } from "../../utils/logger";
import client from "../../utils/mqtt";
import { Sensor, SensorRecord } from "./model/sensor.model";
import { SensorValueRecord } from "./model/sensorValue.model";

class SensorHelper {
    /**
    * @description add value
    */
    static async addSensorValue(_data) 
    {
      try {
        const sensorValue = new SensorValueRecord({
            sensorId: _data.sensor_id,
            value: {name: Object.keys(_data.data)[0], value: Object.values(_data.data)[0]},
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
    }
    public async getData(room,node_id, id_sensor) {
        // const topic = "groupe8/packet//118";
    
        const topic = "groupe8/packet/" + room + "/" + node_id+ "/" + id_sensor; 
        await SensorHelper.getconnection(topic,node_id);
        console.log('done');
    
      }
    
      static async getconnection(topic: string,node_id: string){
        return new Promise((resolve, reject) =>{
          console.log('xwxw')
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
            SensorHelper.addSensorValue(_data);
            console.log("Message:", _data);
            resolve(true);

          });
          client.on("error", function (error) {
          
            console.log("MQTT error:", error);
            reject(error);
          });
      
          client.on("close", function () {
            console.log("MQTT connection closed.");
          });
        })
        
    }
    // public async addSensors(sensor: Sensor) {
    //     new Promise(async (resolve, reject) => { 
    //         try {
    //             const senors = new SensorRecord(sensor);
    //             await senors.save();
    //             resolve("ADDED_SENSOR");
    //         } catch (err) {
    //             reject(err.toString);
    //         }
            
    //     })
      
    // }
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