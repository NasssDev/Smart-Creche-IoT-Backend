import * as mongoose from 'mongoose';
import { isBinaryOperatorToken } from 'typescript';

const Schema = mongoose.Schema;

export interface SensorValue extends mongoose.Document {
   _id: mongoose.Schema.Types.ObjectId;
   accountId: mongoose.Schema.Types.ObjectId;
   sensorId: mongoose.Schema.Types.ObjectId;
   value: number;
   isNegative: boolean;
   date: Date;
}

const SensorValueSchema = new Schema(
   {
        accountId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Account'
        },
        sensorId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Sensor'
        },
        value: {
            type: Number,
            required: true,
        },
        isNegative: {
            type: Boolean,
            required: true,
            default: false
        },
        date: {
            type: Date,
            required: true
        }
    }
);

export const SensorValueRecord = mongoose.model<SensorValue>('SensorValue', SensorValueSchema);
