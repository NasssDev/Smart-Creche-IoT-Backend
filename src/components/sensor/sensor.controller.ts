import client from "../../utils/mqtt";
import { CountryRecord } from "../country/country.model";
import { SensorRawData } from "./model/sensorRaw.model";
import { SensorValueRecord } from "./model/sensorValue.model";
import sensorHelper from "./sensor.helper";

export default class SensorController {
    static getData(room,node_id, id_sensor): void {
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
        SensorController.getconnection(topic,node_id);
    
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
        client.on("message", function (topic, message) {
          const messageString = message.toString();
          const data = JSON.parse(messageString);
            data.node_id = node_id;
            sensorHelper.addSensorValue(data);
          console.log("Message:", data);
        });
        client.on("error", function (error) {
          console.log("MQTT error:", error);
        });
    
        client.on("close", function () {
          console.log("MQTT connection closed.");
        });
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
        const { sensor_id, data, node_id, source_address, tx_time_ms_epoch } = rawObj
        try{
          const sensor = new SensorValueRecord({
            accountId: "64b7d3c5e5929ed0614fb986",
            sensorId: sensor_id,
            value: data.lux,
            nodeId: node_id,
            location: source_address,
            date: tx_time_ms_epoch
          });
          await sensor.save();

          console.log(await CountryRecord.find({_id: '64b51f9dd896af49cde3843e'}));
          
        }catch(error){
          console.log(error);
        }
       
        
    }
}




export const sensorController = new SensorController();
