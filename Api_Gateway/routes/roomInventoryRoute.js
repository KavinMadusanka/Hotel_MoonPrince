import express from "express";
import roomInventoryProxy from "../proxy/roomInventoryProxy.js";

const router = express.Router();

router.use("/", roomInventoryProxy);

export default router;