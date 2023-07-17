"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sensorController = void 0;
var mqtt_1 = require("../../utils/mqtt");
var SensorController = /** @class */ (function () {
    function SensorController() {
    }
    SensorController.getData = function () {
        var topic = "groupe8/packet/63c09edc-771b-4e15-ab00-237bb926b040/0519adec-dcf7-40f2-a73d-3ca7cb3a3dcd/118";
        SensorController.getconnection(topic);
    };
    SensorController.getconnection = function (topic) {
        mqtt_1.default.on('connect', function () {
            console.log("Connected MQTT!");
            // Subscribe to the topic
            mqtt_1.default.subscribe(topic, function (error) {
                if (error) {
                    console.log("Error subscribing to topic:", error);
                }
                else {
                    console.log("Subscribed to topic successfully!");
                }
            });
        });
        // Handle MQTT events and messages
        mqtt_1.default.on('message', function (topic, message) {
            console.log("Received message on topic:", topic);
            console.log("Message:", message.toString());
        });
        mqtt_1.default.on('error', function (error) {
            console.log("MQTT error:", error);
        });
        mqtt_1.default.on('close', function () {
            console.log("MQTT connection closed.");
        });
    };
    return SensorController;
}());
exports.default = SensorController;
exports.sensorController = new SensorController();
