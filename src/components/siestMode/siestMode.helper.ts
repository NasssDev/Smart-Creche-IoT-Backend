import client from "../../utils/mqtt";

class SiesteModeHelper { 
    public async onMode() { 
        new Promise((resolve, reject) => {
            console.log("START");
            try {
            // client.on("connect", function () {
                console.log("Connected MQTT!");
                const topic = "groupe8/request/63c09edc-771b-4e15-ab00-237bb926b040";
                const message = {
                    "cmd_id": 104,
                    "destination_address": "e9f670bb-9b7e-412a-beaf-376f029b3445",
                    "ack_flags": 0,
                    "cmd_type": 207
                };
                client.publish(topic, JSON.stringify(message));
            resolve(true);
        } catch (err) {
            reject(err);
        }
            });
        // })
        
        // Handle MQTT events and messages
        // client.on("message", function (topic, message) {
        //   console.log("Message:", message.toString());
        // });
       
    }
    public offMode() { 
        new Promise((resolve, reject) => {
            try {
                const topic = "groupe8/request/63c09edc-771b-4e15-ab00-237bb926b040";
                const message = {
                    "cmd_id": 104,
                    "destination_address": "e9f670bb-9b7e-412a-beaf-376f029b3445",
                    "ack_flags": 0,
                    "cmd_type": 208
                };
                client.publish(topic, JSON.stringify(message));
                resolve(true);
            } catch (err) {
                reject(err);
            }
            });
    }
}
export default new SiesteModeHelper();