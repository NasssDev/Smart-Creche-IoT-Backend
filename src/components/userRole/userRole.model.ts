import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface Notification extends mongoose.Document {
    mouvement: boolean;
    temperature: boolean;
    co2: boolean;
    humidity: boolean;
    noise: boolean;
    waterLeak: boolean;
 }
 
 const NotificationSchema = new Schema(
    {
        mouvement: {
            type: Boolean,
            required: true,
            default: true
        },
        temperature: {
            type: Boolean,
            required: true,
            default: true
        },
        co2: {
            type: Boolean,
            required: true,
            default: true
        },
        humidity: {
            type: Boolean,
            required: true,
            default: true
        },
        noise: {
            type: Boolean,
            required: true,
            default: true
        },
        waterLeak: {
            type: Boolean,
            required: true,
            default: true
        }
     }
 );

export interface UserRole extends mongoose.Document {
   _id: mongoose.Schema.Types.ObjectId;
   userId: mongoose.Schema.Types.ObjectId;
   accountId: mongoose.Schema.Types.ObjectId;
   roleId: mongoose.Schema.Types.ObjectId;
   isActive: boolean;
   notifications: Notification;
   updatedAt: Date;
}

const UserRoleSchema = new Schema(
   {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        accountId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Account'
        },
        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Role'
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true
        },
        notifications: {
            type: NotificationSchema,
        },
        updatedAt: {
            type: Date,
            required: true
        }
    }
);

export const UserRoleRecord = mongoose.model<UserRole>('UserRole', UserRoleSchema);
