import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface SensorEvent extends mongoose.Document {
    sensorId: mongoose.Schema.Types.ObjectId;
    value: number;
 }
 
 const SensorEventSchema = new Schema(
    {
         sensorId: {
             type: mongoose.Schema.Types.ObjectId,
             required: true,
             ref: 'Sensor'
         },
         value: {
             type: Number,
             required: true
         }
     },
     { _id: false }
 );

export interface Event extends mongoose.Document {
   _id: mongoose.Schema.Types.ObjectId;
   accountId: mongoose.Schema.Types.ObjectId; 
   action: string;
   sensor: string;
}

const EventSchema = new Schema(
   {
        accountId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Account'
        },
        action: {
            type: String,
        },
        sensor: {
            type: String,
        },

    },
    { timestamps: true }
);

export const EventRecord = mongoose.model<Event>('Event', EventSchema);
