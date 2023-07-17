import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

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
     }
 );

export interface Account extends mongoose.Document {
   _id: mongoose.Schema.Types.ObjectId;
   name: string;
   siret: string;
   type: string;
   address: Address;
   email: string;
   phone: number;
   createdAt: Date;
   updatedAt: Date;
   createdBy: mongoose.Schema.Types.ObjectId;
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
        email: {
            type: String,
        },
        phone: {
            type: Number,
        },
        createdAt: {
            type: Date,
            required: true
        },
        updatedAt: {
            type: Date,
            required: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }
);

export const AccountRecord = mongoose.model<Account>('Account', AccountSchema);
