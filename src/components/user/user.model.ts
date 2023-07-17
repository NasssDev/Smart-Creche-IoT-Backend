import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface User extends mongoose.Document {
   _id: mongoose.Schema.Types.ObjectId;
   lastName: string;
   firstName: string;
   email: string;
   password: string;
   createdAt: Date;
   updatedAt: Date;
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
        createdAt: {
            type: Date,
            required: true
        },
        updatedAt: {
            type: Date,
            required: true
        }
    }
);

export const UserRecord = mongoose.model<User>('User', UserSchema);
