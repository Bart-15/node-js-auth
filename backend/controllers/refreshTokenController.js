import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
dotenv.config({path:'./.env'});

const refresh_secret = process.env.REFRESH_TOKEN_SECRET;
const access_secret = process.env.ACCESS_TOKEN_SECRET;


export const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const userFound = await User.findOne({ refreshToken }).exec();
    if (!userFound) return res.sendStatus(403); //Forbidden 
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || userFound.email !== decoded.email) return res.sendStatus(403);
            const roles = Object.values(userFound.roles).filter(Boolean);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": decoded.email,
                        "roles": roles
                    }
                },
                access_secret,
                { expiresIn: '10s' }
            );
            res.json({ roles, accessToken })
        }
    );
}



// with handle reuse token

// export const handleRefreshToken =  async(req, res) => {
//     const cookies = req.cookies;
//     if(!cookies?.jwt) return res.sendStatus(401);
//     const refreshToken = cookies.jwt;
//     res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});


//     const userFound = await User.findOne({refreshToken}).exec();

//     /*  
//         If the user try reuse the token;
//     */ 
//     if(!userFound) {
//         jwt.verify(
//             refreshToken,
//             refresh_secret,
//             async (err, decoded) => {
//                 if(err) return res.sendStatus(403) //Forbidden;
//                 console.log('User attempted to reuse token')
//                 const caughtUser = await User.findOne({email:decoded.email}).exec();
//                 caughtUser.refreshToken = [];
//                 const result = await caughtUser.save();
//                 console.log("user result", result)
//             }
//         )
//         return res.sendStatus(403); //Forbidden
        
//     };

//     const newRefreshTokenArray = userFound.refreshToken.filter(rt => rt !== refreshToken);

//     /*
//         If the token is still valid then proceed and verify the refresh token;
//     */
//     jwt.verify(
//         refreshToken,
//         refresh_secret,
//         async (err, decoded) => {
//             if(err){
//                 userFound.refreshToken = [...newRefreshTokenArray];
//                 await userFound.save();
//             }

//             if(err || userFound.email !== decoded.email) return res.sendStatus(403); //Forbidden
//             const roles = Object.values(userFound.roles).filter(Boolean);
//             const accessToken = jwt.sign(
//                 {
//                     "UserInfo" : {
//                         "email":decoded.email,
//                         "roles":roles
//                     }
//                 },
//                 access_secret,
//                 {expiresIn:'10s'}
//             )
            
//             const newRefreshToken = jwt.sign(
//                 {"email": userFound.email},
//                 refresh_secret,
//                 {expiresIn:'1d'}
//             )

//             userFound.refreshToken = [...newRefreshTokenArray, newRefreshToken];
//             await userFound.save();

//             // Creates Secure Cookie with refresh token
//             res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

//             res.json({roles, accessToken});
//         }
//     ) 
// }

