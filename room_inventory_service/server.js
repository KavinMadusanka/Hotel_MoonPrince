import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import swaggerSpec from "./config/swagger.js";
import roomTypeRoutes from "./routes/roomTypeRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import holdRoutes from "./routes/holdRoutes.js";

const app = express();

connectDB();

app.use(helmet());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/room-types", roomTypeRoutes);
app.use("/rooms", roomRoutes);
app.use("/availability", availabilityRoutes);
app.use("/holds", holdRoutes);

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