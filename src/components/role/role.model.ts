import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface Role extends mongoose.Document {
   _id: mongoose.Schema.Types.ObjectId;
   isAdmin: boolean;
   isDefault: boolean;
   type: string;
   name: string;
}

const RoleSchema = new Schema(
   {
        isAdmin: {
            type: Boolean,
            required: true,
            default: true
        },
        isDefault: {
            type: Boolean,
            required: true,
            default: true
        },
        type: {
            type: String,
            required: true
        },
        name: {
            type: String,
        }
    }
);

export const RoleRecord = mongoose.model<Role>('Role', RoleSchema);
