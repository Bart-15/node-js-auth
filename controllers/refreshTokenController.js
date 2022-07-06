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
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: false});


    const userFound = await User.findOne({refreshToken}).exec();

    /*  
        If the user try reuse the token;
    */ 
    if(!userFound) {
        jwt.verify(
            refreshToken,
            refresh_secret,
            async (err, decoded) => {
                if(err) return res.sendStatus(403) //Forbidden;
                console.log('User attempted to reuse token')
                const caughtUser = await User.findOne({name:decoded.name}).exec();
                caughtUser.refreshToken = [];
                const result = await caughtUser.save();
                console.log(result)
            }
        )
        
    };

    const newRefreshTokenArray = userFound.refreshToken.filter(rt => rt !== refreshToken);

    /*
        If the token is still valid then proceed and verify the refresh token;
    */
    jwt.verify(
        refreshToken,
        refresh_secret,
        async (err, decoded) => {
            if(err) {
                userFound.refreshToken = [...newRefreshTokenArray];
                const result = await userFound.save();
                console.log(result);
            }
            if(err || userFound.name !== decoded.name) res.status(403);
            const roles = Object.values(userFound.roles).filter(Boolean);
            const accessToken = jwt.sign(
                {
                    "UserInfo" : {
                        name:decoded.name,
                        roles:roles
                    }
                },
                access_secret,
                {expiresIn:'30s'}
            )
            
            const newRefreshToken = jwt.sign(
                {"name": userFound.name},
                access_secret,
                {expiresIn:'1d'}
            )

            userFound.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            const result = await userFound.save();

            // Creates Secure Cookie with refresh token
            res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: false, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

            res.json({roles, accessToken});
        }
    ) 
}

