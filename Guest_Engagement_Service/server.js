import express from 'express';
import colors from 'colors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import announcementRoutes from './routes/announcementRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

import connectDB from './config/db.js';


connectDB();

const app = express();

// Swagger setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
 
const swaggerDocument = load(
    readFileSync(join(__dirname, 'swagger.yaml'), 'utf8')
);

// cors
const corsOptions = {
    origin: ['http://localhost:5173', 'https://frontend-861717114034.asia-southeast1.run.app'], // Allow your frontend domain
    credentials: true, // Allow credentials (cookies)
};

//middelware
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

// app.use(cors());
app.use(cors(corsOptions));

// API docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customSiteTitle: "Guest Engagement Service API",
    swaggerOptions: {
        persistAuthorization: true,   // keeps the JWT filled in across page reloads
    }
}));

// health check
app.get("/", (req, res) => {
    res.send({
        message: "Guest Engagement Service is running",
        docs: "/api-docs"
    })
})

//port
const PORT = process.env.PORT;

//routes
app.use("/announcements", announcementRoutes);
app.use("/reviews", reviewRoutes);

app.listen(PORT, () => {
    console.log(
        `Server running in ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white
    );
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`.bgGreen.white);
});