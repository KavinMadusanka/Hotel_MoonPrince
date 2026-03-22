import express from 'express';
import colors from 'colors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import announcementRoutes from './routes/announcementRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

import connectDB from './config/db.js';


connectDB();

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173', // Allow your frontend domain
    credentials: true, // Allow credentials (cookies)
};

//middelware
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

// app.use(cors());
app.use(cors(corsOptions));

app.get("/", (req, res) => {
    res.send({
        message: "welcome to resturant managment server"
    })
})

//port
const PORT = process.env.PORT;

//routes
app.use("/announcements", announcementRoutes);
app.use("/reviews", reviewRoutes);

app.listen(PORT, () => {
    console.log(`server running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white);
});