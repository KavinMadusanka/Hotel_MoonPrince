import { createProxyMiddleware } from "http-proxy-middleware";

const paymentProxy = createProxyMiddleware({
  target: process.env.PAYMENT_SERVICE,
  changeOrigin: true,
});

export default paymentProxy;