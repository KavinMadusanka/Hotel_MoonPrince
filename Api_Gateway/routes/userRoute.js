import { createProxyMiddleware } from "http-proxy-middleware";

const userProxy = createProxyMiddleware({
  target: process.env.USER_SERVICE,
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    if (req.user) {
      proxyReq.setHeader("user-id", req.user.id);
      proxyReq.setHeader("user-role", req.user.role);
    }
  },
});

export default userProxy;