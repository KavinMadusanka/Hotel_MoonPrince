import { createProxyMiddleware } from "http-proxy-middleware";

const reservationProxy = createProxyMiddleware({
  target: process.env.RESERVATION_SERVICE,
  changeOrigin: true
});

export default reservationProxy;