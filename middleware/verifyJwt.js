import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({path:'./.env'});

const secret = process.env.ACCESS_TOKEN_SECRET;
/*
  1. get the req.headers['authorization'] check if true.
  2. If auth header ===  false or  null then send 401 response else proceed.
  3. Verify token if true then proceed using next();
*/ 
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader) return res.sendStatus(401);

    // verify token, split. Remove the Bearer
    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        secret,
        (err, decoded) => {
            if(err) return res.sendStatus(403);
            req.name = decoded.name

            // proceed to request
            next();
        }
    )
    
}

export default verifyJWT;
