import mongoose from 'mongoose';

const conectionString = `mongodb+srv://${process.env.DB_HOST}/${process.env.DB_NAME}`;
export const connection = mongoose.connect(conectionString, {
   autoCreate: true,
   user: process.env.DB_USER,
   pass: process.env.DB_PASS,
   autoIndex: true
});

// mongoose.set('debug', true);
//mongodb+srv://anonems:<password>@cluster0.xbf4uor.mongodb.net/?retryWrites=true&w=majority
