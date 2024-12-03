import express from 'express';
const app = express();

import cookieParser from 'cookie-parser';
import http from 'http';
import cors from 'cors'
import { config } from 'dotenv';

import connectDB from './db/db.js';
import UserRouter from './routes/UserRoutes.js';
import CaptainRouter from './routes/CaptainRoutes.js';
import RideRouter from './routes/RideRoutes.js';
import MapsRouter from './routes/MapsRoutes.js';
import { InitializeSocket } from './socket.js';

//configuring env variables
config({
    path:'.env'
});


//database connection
connectDB();


//Midllewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//Routes
app.use('/users',UserRouter);
app.use('/captains',CaptainRouter);
app.use('/rides',RideRouter);
app.use('/maps',MapsRouter);


//port
const port = process.env.PORT || 3000;

//server creation
const server = http.createServer(app)


//Initializing socket server
InitializeSocket(server);

server.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`)
})