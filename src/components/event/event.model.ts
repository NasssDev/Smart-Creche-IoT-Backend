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
     }
 );

export interface Event extends mongoose.Document {
   _id: mongoose.Schema.Types.ObjectId;
   date: Date;
   accountId: mongoose.Schema.Types.ObjectId; 
   type: string;
   action: string;
   sensor: SensorEvent;
   isLowState: Boolean;
}

const EventSchema = new Schema(
   {
        date: {
            type: Date,
            required: true,
        },
        accountId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Account'
        },
        type: {
            type: String,
        },
        action: {
            type: String,
        },
        sensor: {
            type: SensorEventSchema,
        },
        isLowState: {
            type: Boolean,
            required: true
        }
    }
);

export const EventRecord = mongoose.model<Event>('Event', EventSchema);
