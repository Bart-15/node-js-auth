import User from '../models/User.js';
import { validateLoginInput } from '../validation/authInputValidation.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config({path:'./.env'});
const access_token = process.env.ACCESS_TOKEN_SECRET;
const refresh_token = process.env.REFRESH_TOKEN_SECRET;


export const login = async (req, res) => {
	const {errors, isValid} = validateLoginInput(req.body);

	if(!isValid) return res.status(400).json(errors);

	try{
		const foundUser = await User.findOne({ email: req.body.email }).exec();
		if (!foundUser) return res.status(409).json({message:"User not found"}); //Unauthorized 
		// evaluate password 
		const passwordMatch = await bcrypt.compare(req.body.password, foundUser.password);
	
		if(!passwordMatch) return res.status(409).json({message:"Password does not match."});
	
		const roles = Object.values(foundUser.roles).filter(Boolean);
		// create JWTs
			const accessToken = jwt.sign(
				{
					"UserInfo": {
						"email": foundUser.email,
						"roles": roles
					}
				},
				access_token,
				{ expiresIn: '10s' }
			);
			const refreshToken = jwt.sign(
				{ "email": foundUser.email },
				refresh_token,
				{ expiresIn: '1d' }
			);
		// Saving refreshToken with current user
			foundUser.refreshToken = refreshToken;
			const result = await foundUser.save();

	
		// Creates Secure Cookie with refresh token
			res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
	
		// Send authorization roles and access token to user
			res.json({ roles, accessToken });
	}catch(e) {
		res.status(500).json("Server error")
	}
}


// export const login = async(req, res) => {
//     const cookies = req.cookies;

//     const {errors, isValid} = validateLoginInput(req.body);

//     if(!isValid) return res.status(400).json(errors);
//     try {
//         // find the user;
//         const user = await User.findOne({email: req.body.email});

//         if(!user) return res.status(404).json({message: 'User not found'});

//         const checkPassword = bcrypt.compareSync(req.body.password, user.password);

//         if(!checkPassword) return res.status(409).json({message: 'Incorrect password'});

//         if(checkPassword) {
//           const roles = Object.values(user.roles).filter(Boolean);
//           // TODO: GENERATE JWT TOKEN and Refresh token
//           const accessToken = jwt.sign(
//             {
//               "UserInfo":{
//                 "email": user.email,
//                 "roles": roles
//               }
//             },
//             access_token,
//             {expiresIn:'10s'}
//           ) 

//           const newRefreshToken = jwt.sign(
//             {"email": user.email},
//             refresh_token,
//             {expiresIn:'1d'}
//           ) 

//           let newRefreshTokenArray = !cookies?.jwt ? user.refreshToken : user.refreshToken.filter(rt => rt !== cookies.jwt);

//           if (cookies?.jwt) {
//             const refreshToken = cookies.jwt;
//             const foundToken = await User.findOne({ refreshToken }).exec();

//             // Detected refresh token reuse!
//             if (!foundToken) {
//                 // clear out ALL previous refresh tokens
//                 newRefreshTokenArray = [];
//             }

//             res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
//           }

//           user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
//           await user.save();

//           /*
//             Create secure refresh token.
//             set the secure = false if dev mode;
//           */ 
//           res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

//           // Send authorization roles and access token to user
//           res.status(200).json({ accessToken, roles, newRefreshToken });
//         }else {
//           res.status(401).json({message:"Unauthorized."})
//         }
//     }catch(e){
//         res.status(500).send(e.message);
//     }
// }