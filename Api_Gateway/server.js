import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';

import userRoutes from "./routes/userRoute.js";
import roomInventoryRoutes from "./routes/roomInventoryRoute.js";
import guestRoutes from "./routes/guestRoute.js";
import paymentRoutes from "./routes/paymentRoute.js";
import reservationRoutes from "./routes/reservationRoute.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'https://frontend-861717114034.asia-southeast1.run.app'],
  credentials: true,
}));

app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/guestService", guestRoutes);
app.use("/api/v1/reservations", reservationRoutes);

app.use(express.json());
app.use("/api/v1/userService", userRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/roomInventoryService", roomInventoryRoutes);

// console.log("USER_SERVICE:", process.env.USER_SERVICE);
// console.log("PAYMENT_SERVICE:", process.env.PAYMENT_SERVICE);

app.get("/", (req, res) => {
  res.send("API Gateway Running 🚀");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API Gateway running on port ${PORT}`);
});