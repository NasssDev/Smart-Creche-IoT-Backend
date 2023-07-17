import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface Sensor extends mongoose.Document {
   _id: mongoose.Schema.Types.ObjectId;
   name: string;
   unit: string;
   isActive: Boolean;
   location: string;
}

const SensorSchema = new Schema(
   {
        name: {
            type: String,
            required: true
        },
        unit: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true
        },
        location: {
            type: String,
        }
    }
);

export const SensorRecord = mongoose.model<Sensor>('Sensor', SensorSchema);
