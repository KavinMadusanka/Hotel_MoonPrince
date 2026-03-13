import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import roomTypeRoutes from "./routes/roomTypeRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";

dotenv.config();

const app = express();

connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/room-types", roomTypeRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/availability", availabilityRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Room & Inventory Service is running",
    service: "room-inventory-service"
  });
});

const PORT = process.env.PORT || 8090;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});