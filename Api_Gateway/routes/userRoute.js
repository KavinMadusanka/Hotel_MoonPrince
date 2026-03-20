import { createProxyMiddleware } from "http-proxy-middleware";

const userProxy = createProxyMiddleware({
  target: process.env.USER_SERVICE,
  changeOrigin: true,
});

export default userProxy;