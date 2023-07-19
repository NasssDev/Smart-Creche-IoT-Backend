"use strict";
exports.__esModule = true;
exports.SensorValueRecord = void 0;
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var SensorValueSchema = new Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Account'
    },
    sensorId: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    nodeId: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    isNegative: {
        type: Boolean,
        "default": false
    },
    date: {
        type: Date,
        required: true
    }
}, { timestamps: true });
exports.SensorValueRecord = mongoose.model('SensorValue', SensorValueSchema);
