import { createProxyMiddleware } from "http-proxy-middleware";

const reservationProxy = createProxyMiddleware({
  target: process.env.RESERVATION_SERVICE || "https://reservation-service-861717114034.asia-southeast1.run.app",
  changeOrigin: true
});

export default reservationProxy;