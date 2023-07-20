"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.sensorController = void 0;
var mqtt_1 = require("../../utils/mqtt");
var sensorValue_model_1 = require("./model/sensorValue.model");
var SensorController = /** @class */ (function () {
    function SensorController() {
    }
    SensorController.getData = function (room, node_id, id_sensor) {
        // const topic = "groupe8/packet//118";
        var room_selected = "63c09edc-771b-4e15-ab00-237bb926b040";
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
        var topic = "groupe8/packet/" + room_selected + "/" + node_id + "/" + id_sensor;
        SensorController.getconnection(topic, node_id);
    };
    SensorController.getconnection = function (topic, node_id) {
        mqtt_1["default"].on("connect", function () {
            console.log("Connected MQTT!");
            // Subscribe to the topic
            mqtt_1["default"].subscribe(topic, function (error) {
                if (error) {
                    console.log("Error subscribing to topic:", error);
                }
                else {
                    console.log("Subscribed to topic successfully!");
                }
            });
        });
        // Handle MQTT events and messages
        // client.on("message", function (topic, message) {
        //   console.log("Message:", message.toString());
        // });
        mqtt_1["default"].on("message", function (topic, message) {
            var messageString = message.toString();
            var data = JSON.parse(messageString);
            data.node_id = node_id;
            exports.sensorController.addData(data);
            console.log("Message:", data);
        });
        mqtt_1["default"].on("error", function (error) {
            console.log("MQTT error:", error);
        });
        mqtt_1["default"].on("close", function () {
            console.log("MQTT connection closed.");
        });
    };
    /**
       * @typedef addData
       */
    /**
     * API to fetch recent data
     * @group IOT - API for iot
     * @returns {object} 200 - Ok
     * @returns {object} 500 - Internal server error
     */
    SensorController.prototype.addData = function (rawObj) {
        return __awaiter(this, void 0, void 0, function () {
            var sensor_id, data, node_id, source_address, tx_time_ms_epoch, sensor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sensor_id = rawObj.sensor_id, data = rawObj.data, node_id = rawObj.node_id, source_address = rawObj.source_address, tx_time_ms_epoch = rawObj.tx_time_ms_epoch;
                        sensor = new sensorValue_model_1.SensorValueRecord({
                            accountId: "64b7d3c5e5929ed0614fb986",
                            sensorId: sensor_id,
                            value: data.lux,
                            nodeId: node_id,
                            location: source_address,
                            date: tx_time_ms_epoch
                        });
                        console.log(sensor);
                        return [4 /*yield*/, sensor.save()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return SensorController;
}());
exports["default"] = SensorController;
exports.sensorController = new SensorController();
