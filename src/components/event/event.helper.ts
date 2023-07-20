import client from "../../utils/mqtt";

class EventModeHelper { 
    public offAc(location, node_id) { 
        new Promise((resolve, reject) => {
            console.log("OFF_AC");
            try {
            // client.on("connect", function () {
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
        return true
    }
    public onAC(location, node_id) { 
        new Promise((resolve, reject) => {
            console.log("ON_AC");
            try {
            // client.on("connect", function () {
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
        return true
    }
    public offMode(): boolean { 
        return true
    }
}
export default new EventModeHelper();