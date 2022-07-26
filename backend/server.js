import express from 'express';
import bodyParser from 'body-parser';
import connectDb from './database/dbConnection.js'
import cors from 'cors';
import dotenv from 'dotenv';
import corsOptions from './config/corsOptions.js';
import credentials from './middleware/credentials.js';
import errorHandler from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';
dotenv.config({path:'./.env'});


import login from './routes/api/auth.js';
import register from './routes/api/register.js';
import logout from './routes/api/logout.js';        
import refresh  from './routes/api/refresh.js';
import student from './routes/api/student.js';
import user from './routes/api/user.js';
import passwordReset from './routes/api/passwordReset.js';

// connect database
connectDb();

// custom logge
const app = express();
const API = process.env.API;

const PORT = process.env.PORT || 3000;

// handle options creds check - before cors
// fetch cookie credentials requirement
app.use(credentials)

// Cross origin resource sharing
app.use(cors(corsOptions));

// use cookie parser
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit:"30mb", extended: true}));



// use all routes
app.use(`${API}`, login);
app.use(`${API}`, register);
app.use(`${API}`, logout);
app.use(`${API}`, refresh);
app.use(`${API}`, student);
app.use(`${API}`, user);
app.use(`${API}`, passwordReset)

// error handler for catching errors;
app.use(errorHandler)

app.listen(PORT, () => {
    console.log("Listening on port", PORT)
})