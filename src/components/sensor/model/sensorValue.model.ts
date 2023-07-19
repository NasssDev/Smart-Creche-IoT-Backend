import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface SensorValue extends mongoose.Document {
   _id: mongoose.Schema.Types.ObjectId;
   accountId: mongoose.Schema.Types.ObjectId;
   sensorId: mongoose.Schema.Types.ObjectId;
   nodeId: string;
   location: string;
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
            type: String,
            required: true,
            // ref: 'Sensor'
        },
        value: {
            type: Number,
            required: true,
        },
        nodeId: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        isNegative: {
            type: Boolean,
            default: false
        },
        date: {
            type: Date,
            required: true
        }
    },
    { timestamps: true }
);

export const SensorValueRecord = mongoose.model<SensorValue>('SensorValue', SensorValueSchema);
