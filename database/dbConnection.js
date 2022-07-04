
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({path:'./.env'});

const connectionURI = process.env.MONGODB_URI;

mongoose.connect(connectionURI, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log("Database connected successfully!");
}).catch(error => console.error(error))