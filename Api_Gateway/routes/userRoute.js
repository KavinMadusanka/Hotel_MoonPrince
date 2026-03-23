import { createProxyMiddleware } from "http-proxy-middleware";

const userProxy = createProxyMiddleware({
  target: process.env.USER_SERVICE || "https://user-service-861717114034.asia-southeast1.run.app",
  changeOrigin: true,
});

export default userProxy;