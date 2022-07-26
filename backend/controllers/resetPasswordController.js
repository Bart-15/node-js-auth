import User from '../models/User.js';
import Token from '../models/Token.js';
import crypto from 'crypto';
import sendResetEmail from '../utils/sendResetEmail.js';
import bcrypt from 'bcrypt';


import dotenv from 'dotenv';
dotenv.config({path:'./.env'});

export const resetPasswordEmail = async (req, res) => {
    const email = req.body.email;
    try{    
        if(!email) return res.status(403).json({message:"Email is required"});

        // let's find the user
        const user = await User.findOne({email:email});
        
        if(!user) return res.status(404).json({message: 'User not found'});

        let userToken = await Token.findOne({userId:user._id});

        if(!userToken) {
            userToken = await new Token({userId:user._id, token: crypto.randomBytes(32).toString("hex")}).save();
        }

        let link = `${process.env.BASE_URL}/password/reset/${user._id}/${userToken.token}`;
        await sendResetEmail(user.userName, user.email, "Password reset", link)
        res.status(200).json({success: true, message:"Email send successfully."})
    }catch(err){    
        res.status(500).send(err.message);
    }
};

export const resetPassword = async(req, res, next) => {
    try {
        const {userId, token} = req.params;
        const {password} = req.body;
        
        if(!password) return res.status(400).json({message: "Password field is required."});

        // find the user in the database;
        const user = await User.findById(userId);

        if(!user) return res.status(400).send("Invalid link or expired.");

        const userToken = await Token.findOne({userId: user._id, token: token});

        if (!userToken) return res.status(400).send("Invalid link or expired");

        const hashedPass = bcrypt.hashSync(req.body.password,  10);
        
        user.password = hashedPass;
        await user.save();
        await userToken.delete();

        res.status(200).json({message:"Password reset successfully."})


    } catch(err) {
        res.status(500).send(err.message);
    }
}