import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface WorkHours extends mongoose.Document {
    start: number;
    end: number;
 }
 
 const WorkHoursSchema = new Schema(
    {
         start: {
             type: Number
         },
         end: {
             type: Number
         }
     },
     { _id: false }
 );

export interface SiestMode extends mongoose.Document {
   _id: mongoose.Schema.Types.ObjectId;
   accountId: mongoose.Schema.Types.ObjectId;
   isManual: Boolean;
   isActive: Boolean;
   workHours: WorkHours;
   updatedBy: mongoose.Schema.Types.ObjectId;
   sensorList: [mongoose.Schema.Types.ObjectId]
}

const SiestModeSchema = new Schema(
   {
        accountId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Account'
        },
        isManual: {
            type: Boolean
        },
        isActive: {
            type: Boolean
        },
        workHours: {
            type: WorkHoursSchema
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId
        },
        sensorList: {
            type: [mongoose.Schema.Types.ObjectId]
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

export const SiestModeRecord = mongoose.model<SiestMode>('SiestMode', SiestModeSchema);
