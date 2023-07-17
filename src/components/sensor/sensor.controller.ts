import client from "../../utils/mqtt";

class SensorController {


  private static client: SensorController;

  static getData() {
    const topic = "<group>/packet/<gateway_id>/<node_id>/<sensor_id>";
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


}

export const sensorController = new SensorController();