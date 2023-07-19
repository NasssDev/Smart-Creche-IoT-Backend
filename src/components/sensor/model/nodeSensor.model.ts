import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface NodeSensor extends mongoose.Document {
    _id: mongoose.Schema.Types.ObjectId;
    nodeId: string;
    sensorId: string;
    roomId: string;
 }
 
 export const NodeSensorSchema = new Schema(
    {
        nodeId: {
            type: String,
        },
        sensorId: {
            type: String,
        },
        roomId: {
            type: String,
        }
     }
 );

export const NodeSensorRecord = mongoose.model<NodeSensor>('NodeSensor', NodeSensorSchema);
