import express from "express";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";

const router = express.Router();

router.use(
  "/",
  createProxyMiddleware({
    target: process.env.RESERVATION_SERVICE || "https://reservation-service-861717114034.asia-southeast1.run.app",
    changeOrigin: true,
    pathRewrite: (path) => `/api/v1/reservations${path === "/" ? "" : path}`,
    on: {
      proxyReq: (proxyReq, req, res) => {
        fixRequestBody(proxyReq, req, res);
      },
      error: (err, req, res) => {
        console.error("Reservation proxy error:", err.message);
        if (!res.headersSent) {
          res.status(500).json({
            message: "Proxy error while contacting reservation service",
            error: err.message
          });
        }
      }
    }
  })
);

export default router;