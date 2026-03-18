import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

import connectDB from './config/db.js';
import userRoute from './routers/userRouters.js';

dotenv.config()

connectDB();

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173', // Allow your frontend domain
    credentials: true, // Allow credentials (cookies)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

// app.use((req, res, next) => {
//   console.log("REQUEST PATH:", req.path);
//   next();
// });

//middelware
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
// app.use(cors());
app.use(cors(corsOptions));
app.use(helmet({crossOriginResourcePolicy: { policy: "cross-origin" }}));
app.use("/user_photos", express.static("user_photos"));

app.use("/api/v1/user", userRoute);

app.get("/", (req, res) => {
    res.send({
        message: "welcome to resturant managment server"
    })
})

//port
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`server running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white);
});