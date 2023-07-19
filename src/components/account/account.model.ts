import * as mongoose from 'mongoose';
import { NodeSensor , NodeSensorSchema} from '../sensor/model/nodeSensor.model';

const Schema = mongoose.Schema;

export interface Room extends mongoose.Document {
    name: string;
    roomId: string;
    area: number;
    sensors: [NodeSensor];
 }
 
 const RoomSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        roomId: {
            type: String,
        },
        area: {
            type: Number,
        },
        sensors: {
            type: [NodeSensorSchema],
        }
     }
 );

export interface Address extends mongoose.Document {
    address: string;
    optional: string;
    postalCode: number;
    city: string;
    coutryId: mongoose.Schema.Types.ObjectId;
 }
 
 const AddressSchema = new Schema(
    {
         address: {
             type: String,
             required: true
         },
         optional: {
             type: String,
         },
         type: {
             type: String,
             required: true,
             default: 'collective'
         },
         postalCode: {
             type: Number,
             required: true
         },
         city: {
             type: String,
             required: true
         },
         countyId: {
             type: mongoose.Schema.Types.ObjectId,
             ref: 'Coutry'
         }
     },
     { _id: false }
 );

export interface Account extends mongoose.Document {
   _id: mongoose.Schema.Types.ObjectId;
   name: string;
   siret: string;
   type: string;
   address: Address;
   roomList: [Room]; 
   email: string;
   phone: number;
   updatedBy: mongoose.Schema.Types.ObjectId;
}

const AccountSchema = new Schema(
   {
        name: {
            type: String,
            required: true
        },
        siret: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        address: {
            type: AddressSchema,
        },
        roomList: {
            type: [RoomSchema],
        },
        email: {
            type: String,
        },
        phone: {
            type: Number,
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        isDeleted: {
            type: Boolean,
            default: false
         },
    },
    { timestamps: true }
);

export const AccountRecord = mongoose.model<Account>('Account', AccountSchema);
