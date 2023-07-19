import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface User extends mongoose.Document {
   _id: mongoose.Schema.Types.ObjectId;
   lastName: string;
   firstName: string;
   email: string;
   password: string;
   resetPassword: boolean;
   resetPasswordStep: number;
}

const UserSchema = new Schema(
   {
        lastName: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        resetPassword: {
            type: Boolean,
            default: false
        },
        resetPasswordStep: {
            type: Number,
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

export const UserRecord = mongoose.model<User>('User', UserSchema);
