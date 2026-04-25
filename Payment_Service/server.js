import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

import connectDB from './config/db.js';
import billingRoutes from './routers/billingRoute.js';
import itemsRoutes from './routers/itemsRoute.js';

import { setupSwagger } from './swagger.js';

dotenv.config()

connectDB();

const app = express();

const corsOptions = {
    origin: ['http://localhost:5173', 'https://frontend-861717114034.asia-southeast1.run.app'], // Allow your frontend domain
    credentials: true, // Allow credentials (cookies)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

//middelware
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
// app.use(cors());
app.use(cors(corsOptions));
app.use(helmet({crossOriginResourcePolicy: { policy: "cross-origin" }}));

// Swagger UI will be available at:  http://localhost:8050/api-docs
setupSwagger(app);

app.use("/billing", billingRoutes);
app.use("/items", itemsRoutes);

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

// check CI?CD pipeline