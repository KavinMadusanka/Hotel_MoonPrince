import { createProxyMiddleware } from "http-proxy-middleware";

const guestProxy = createProxyMiddleware({
  target: process.env.GUEST_SERVICE,
  changeOrigin: true,
});

export default guestProxy;