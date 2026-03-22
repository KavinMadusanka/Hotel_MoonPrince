import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";

const roomInventoryProxy = createProxyMiddleware({
  target: process.env.ROOM_INVENTORY_SERVICE,
  changeOrigin: true,
  pathRewrite: {
    "^/api/v1/roomInventoryService": "",
  },
  proxyTimeout: 15000,
  timeout: 15000,
  on: {
    proxyReq: (proxyReq, req, res) => {
      const contentType = req.headers["content-type"] || "";

      if (contentType.includes("application/json")) {
        fixRequestBody(proxyReq, req, res);
      }
    },
    error: (err, req, res) => {
      console.error("Room inventory proxy error:", err.message);

      if (!res.headersSent) {
        res.status(500).json({
          message: "Proxy error while contacting room inventory service",
          error: err.message,
        });
      }
    },
  },
});

export default roomInventoryProxy;