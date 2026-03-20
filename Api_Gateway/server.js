import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoute.js";
// import roomRoutes from "./routes/roomRoute.js";
// import guestRoutes from "./routes/guestRoute.js";
import paymentRoutes from "./routes/paymentRoute.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(morgan("dev"));

// Routes
app.use("/api/v1/userService", userRoutes);
// app.use("/api/v1/room", roomRoutes);
// app.use("/api/v1/guest", guestRoutes);
app.use("/api/v1/payment", paymentRoutes);

app.listen(process.env.PORT, () => {
  console.log(`API Gateway running on port ${process.env.PORT}`);
});