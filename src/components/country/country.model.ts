import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface Country extends mongoose.Document {
   _id: number;
   name: string;
   iso3: string;
   iso2: string;
   phone_code: string;
   capital: string;
   currency: string;
}

const CountrySchema = new Schema(
   {
      _id: {
         type: Number,
         required: true
      },
      name: {
         type: String,
         required: true
      },
      iso3: {
         type: String,
         required: true
      },
      iso2: {
         type: String,
         required: true
      },
      phone_code: {
         type: String,
         required: true
      },
      capital: {
         type: String,
         required: true
      },
      currency: {
         type: String,
         required: true
      }
   },
   { timestamps: false }
);

export const CountryRecord = mongoose.model<Country>('Country', CountrySchema);
