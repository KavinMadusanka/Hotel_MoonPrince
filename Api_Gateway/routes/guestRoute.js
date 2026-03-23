import { createProxyMiddleware } from "http-proxy-middleware";

const guestProxy = createProxyMiddleware({
  target: process.env.GUEST_SERVICE || "https://guest-engagement-service-861717114034.asia-southeast1.run.app",
  changeOrigin: true,
});

export default guestProxy;