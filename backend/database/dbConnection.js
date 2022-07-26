
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {fileURLToPath} from 'url';
import path from 'path'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionURI = process.env.MONGODB_URI;

const connectDb = async () => {
    try {
        await mongoose.connect(connectionURI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        console.log("Database connected successfully! ✔️")
    }catch(err) {
        console.log(err)
    }
}

export default connectDb;