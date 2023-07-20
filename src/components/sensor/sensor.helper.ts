import { logger } from "../../utils/logger";
import client from "../../utils/mqtt";
import { Sensor, SensorRecord } from "./model/sensor.model";
import { SensorValueRecord } from "./model/sensorValue.model";
const messageListeners = {};
class SensorHelper {

    /**
    * @description add value
    */
    static async addSensorValue(_data) {
        try {
            const sensorValue = new SensorValueRecord({
                sensorId: _data.sensor_id,
                value: { name: Object.keys(_data.data)[0], value: Object.values(_data.data)[0] },
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
    public async  getData(room, node_id, id_sensor) {
        const topic = "groupe8/packet/" + room + "/" + node_id + "/" + id_sensor;

        // Check if the message listener for this topic already exists
        if (!messageListeners[topic]) {
          // If not, create the MQTT connection and add the message listener
          await SensorHelper.getconnection(topic, node_id);
  }
    }
    
    static async getconnection(topic: string, node_id: string) {
        return new Promise((resolve, reject) => {
          // Check if the message listener for this topic already exists
          if (!messageListeners[topic]) {
            // If not, create a new listener function and subscribe to the topic
            const messageListener = function (topic, message) {
              const messageString = message.toString();
              let _data = JSON.parse(messageString);
              _data.node_id = node_id;
              SensorHelper.addSensorValue(_data);
              console.log("Inserted:", _data);
            };
      
            // Subscribe to the topic
            client.subscribe(topic, function (error) {
              if (error) {
                console.log("Error subscribing to topic:", error);
                reject(error);
              } else {
                console.log("Subscribed to topic successfully!");
                // Add the listener to the messageListeners object
                messageListeners[topic] = messageListener;
                // Add the listener to the MQTT client
                client.on("message", messageListener);
                // Resolve the promise
                resolve("Done");
              }
            });
          } else {
            // If the listener for this topic already exists, simply resolve the promise
            resolve("Skipped");
          }
      
          client.on("error", function (error) {
            console.log("MQTT error:", error);
            reject(error);
          });
      
          client.on("close", function () {
            console.log("MQTT connection closed.");
          });
        });
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
    public async byLocation(locationString: String) {
        new Promise(async (resolve, reject) => {
            try {
                const senors = await SensorValueRecord.findOne({ location: locationString });
                resolve(senors);
            } catch (err) {
                reject(err.toString);
            }
            
        })
      
    }
    public async getSensorByLocation(locationString: String) {
        new Promise(async (resolve, reject) => {
            try {
                let _sensorList = [];
                const sensors = await SensorValueRecord.aggregate([
                    { $sort: { createdAt: -1 } },
                    {
                        $group: {
                            _id: { location: "$location", sensorId: "$sensorId" }, sensorvalues: { $push: "$value" }
        
                        }
                    },
                    { $project: { sensorvalues: { $slice: ["$sensorvalues", 1] } } }
                ]);
                _sensorList = sensors.filter((ele) => ele["_id"].location == locationString);
                console.log(_sensorList);
                resolve(_sensorList);
            } catch (err) {
                reject(err.toString);
            }
            
    })

    }
    public async getSensorValAvg(sensor_id: String) {
        new Promise(async (resolve, reject) => {
            try {
                let _sensorList = [];
                const sensors = await SensorValueRecord.aggregate([
                    { $sort: { createdAt: -1 } },
                    {
                        $group: {
                            _id: { location: "$location", sensorId: "$sensorId" }, sensorvalues: { $push: "$value" }
                        }
                    },
                    { $project: { sensorvalues: { $slice: ["$sensorvalues", 1] } } }
                ]);
                _sensorList = sensors.filter((ele) => ele["_id"].sensorId == sensor_id);
                resolve(_sensorList);
            } catch (err) {
                reject(err.toString);
            }
            
    })
      

    }
}

export default new SensorHelper();