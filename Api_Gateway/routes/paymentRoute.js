import { createProxyMiddleware } from "http-proxy-middleware";

const paymentProxy = createProxyMiddleware({
  target: process.env.PAYMENT_SERVICE || "https://payment-service-861717114034.asia-southeast1.run.app",
  changeOrigin: true,
});

export default paymentProxy;