import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface ValueObject extends mongoose.Document {
    name: string;
    value: number;
 }
 
 const ValueObjectSchema = new Schema(
    {
         name: {
             type: String,
         },
         value: {
             type: Number,
         }
     },
     { _id: false }
 );

export interface SensorValue extends mongoose.Document {
   _id: mongoose.Schema.Types.ObjectId;
   sensorId: mongoose.Schema.Types.ObjectId;
   nodeId: string;
   location: string;
   value: ValueObject;
   isNegative: boolean;
   date: Date;
}

const SensorValueSchema = new Schema(
   {
        sensorId: {
            type: String,
            required: true,
            // ref: 'Sensor'
        },
        value: {
            type: ValueObjectSchema,
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
