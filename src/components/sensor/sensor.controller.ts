import client from "../../utils/mqtt";

export default class SensorController {

    static getData(): void {
    const topic = "groupe8/packet/63c09edc-771b-4e15-ab00-237bb926b040/0519adec-dcf7-40f2-a73d-3ca7cb3a3dcd/118";
    SensorController.getconnection(topic);
  }

  static getconnection(topic: string) {

    client.on('connect', function () {
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
    client.on('message', function (topic, message) {
      console.log("Received message on topic:", topic);
      console.log("Message:", message.toString());
    });

    client.on('error', function (error) {
      console.log("MQTT error:", error);
    });

    client.on('close', function () {
      console.log("MQTT connection closed.");
    });
  }
}




export const sensorController = new SensorController();
