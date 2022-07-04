import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import corsOptions from './middleware/credentials.js';
import errorHandler from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';
import './database/dbConnection.js'
dotenv.config({path:'./.env'});


import login from './routes/api/auth.js';
import register from './routes/api/register.js';
import refresh  from './routes/api/refresh.js';
import student from './routes/api/student.js';


// custom logge
const app = express();
const API = process.env.API;

const PORT = process.env.PORT || 3000;

// cors options config
app.use(cors(corsOptions));

// use cookie parser
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit:"30mb", extended: true}));



// use all routes
app.use(`${API}`, refresh);
app.use(`${API}`, login);
app.use(`${API}`, register);
app.use(`${API}`, student);

// error handler for catching errors;
app.use(errorHandler)

app.listen(PORT, () => {
    console.log("Listening on port", PORT)
})