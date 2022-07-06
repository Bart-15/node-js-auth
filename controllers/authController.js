import User from '../models/User.js';
import { validateLoginInput } from '../validation/authInputValidation.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config({path:'./.env'});
const access_token = process.env.ACCESS_TOKEN_SECRET;
const refresh_token = process.env.REFRESH_TOKEN_SECRET;

export const  login = async(req, res) => {
    const cookies = req.cookies;

    const {errors, isValid} = validateLoginInput(req.body);

    if(!isValid) return res.status(400).json(errors);
    try {
        // find the user;
        const user = await User.findOne({email: req.body.email});

        if(!user) return res.status(404).json({message: 'User not found'});

        const checkPassword = bcrypt.compareSync(req.body.password, user.password);

        if(!checkPassword) return res.status(400).json({message: 'Incorrect password'});

        if(checkPassword) {
          const roles = Object.values(user.roles).filter(Boolean);
          // TODO: GENERATE JWT TOKEN and Refresh token
          const accessToken = jwt.sign(
            {
              "UserInfo":{
                name: user.name,
                roles: roles
              }
            },
            access_token,
            {expiresIn:'30s'}
          ) 

          const newRefreshToken = jwt.sign(
            {"name": user.name},
            refresh_token,
            {expiresIn:'1d'}
          ) 

          let newRefreshTokenArray = !cookies?.jwt ? user.refreshToken : user.refreshToken.filter(rt => rt !== cookies.jwt);

          if (cookies?.jwt) {
            const refreshToken = cookies.jwt;
            const foundToken = await User.findOne({ refreshToken }).exec();

            // Detected refresh token reuse!
            if (!foundToken) {
                // clear out ALL previous refresh tokens
                newRefreshTokenArray = [];
            }

            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: false });
          }

          user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
          await user.save();

          /*
            Create secure refresh token.
            set the secure = false if dev mode;
          */ 
          res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: false, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

          // Send authorization roles and access token to user
          res.status(200).json({ accessToken });
        }else {
          res.status(401).jso({message:"Unauthorized."})
        }
    }catch(e){
        res.status(500).send(e.message);
    }
}