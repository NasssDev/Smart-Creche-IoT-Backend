"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mqtt = require("mqtt");
var client = mqtt.connect("mqtt://mqtt.arcplex.fr:2295", {
    username: "groupe8",
    password: "1IC5VzoA7T4c"
});
// client.on('connect', () => {
//   console.log("Connected MQTT!");
// });
exports.default = client;
