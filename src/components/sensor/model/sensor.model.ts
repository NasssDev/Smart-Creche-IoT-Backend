import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface Sensor extends mongoose.Document {
   _id: mongoose.Schema.Types.ObjectId;
   sensorId: number;
   name: string;
   unit: string;
}

const SensorSchema = new Schema(
   {
        sensorId: {
            type: Number
        },
        name: {
            type: String,
            required: true
        },
        unit: {
            type: String,
            required: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

export const SensorRecord = mongoose.model<Sensor>('Sensor', SensorSchema);
