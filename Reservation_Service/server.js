import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import connectDB from "./config/db.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import checkInOutRoutes from "./routes/checkInOutRoutes.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import { swaggerUi, swaggerSpec } from "./config/swagger.js";

dotenv.config();

const app = express();

connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Reservation Service API is running"
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1/reservations", reservationRoutes);
app.use("/api/v1/checkinout", checkInOutRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8060;

app.listen(PORT, () => {
  console.log(`Reservation Service running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});