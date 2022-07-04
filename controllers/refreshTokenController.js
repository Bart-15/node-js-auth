import jwt from 'jsonwebtoken';
import bcrypt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
dotenv.config({path:'./.env'});

const refresh_secret = process.env.REFRESH_TOKEN_SECRET;
const access_secret = process.env.ACCESS_TOKEN_SECRET;

export const handleRefreshToken =   async(req, res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;

    const userFound = await User.find({refreshToken}).exec();

    /*
        If the user try reuse the token;
    */ 
    if(!userFound) return res.sendStatus(403);

    jwt.verify(
        refreshToken,
        refresh_secret,
        (err, decoded) => {
            if(err || userFound.name !== decoded.name) res.status(403);
            const accessToken = jwt.sign(
                {"name": decoded.name},
                access_secret,
                {expiresIn:'30s'}
            )
            res.json({accessToken});
        }
    ) 
}

