import '../database/dbConnection.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import connectDb from '../database/dbConnection.js'

connectDb();

User.collection.drop();

const closeConnection = async() => {
    return await mongoose.disconnect();
}


const userSeeder = async() => {
    console.log("Seeding...");
    console.log("In progress 🚧");
    try {
        let password = "superAdmin123"
        const hashedPass = await bcrypt.hash(password, 10);

       await new User({
            name:'Admin',
            email:"admin@mail.com",
            lastName:"Anonymous",
            roles: {"User":5000, "Admin": 3000, "Editor":4000 },
            password:hashedPass
        }).save()

        closeConnection();
        console.log("Success ✔️")
    }catch(err) {
        console.log(err.stack);
    }

}

userSeeder();