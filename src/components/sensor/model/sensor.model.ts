import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface Sensor extends mongoose.Document {
   _id: mongoose.Schema.Types.ObjectId;
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
        }
    },
    { timestamps: true }
);

export const SensorRecord = mongoose.model<Sensor>('Sensor', SensorSchema);
