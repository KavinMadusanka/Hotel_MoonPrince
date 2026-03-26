import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";

const userProxy = createProxyMiddleware({
  target: process.env.USER_SERVICE || "https://user-service-861717114034.asia-southeast1.run.app",
  changeOrigin: true,
  on: {
      proxyReq: (proxyReq, req, res) => {
        const contentType = req.headers["content-type"] || "";
  
        if (contentType.includes("application/json")) {
          fixRequestBody(proxyReq, req, res);
        }
      },
      error: (err, req, res) => {
        console.error("User service proxy error:", err.message);
  
        if (!res.headersSent) {
          res.status(500).json({
            message: "Proxy error while contacting user service",
            error: err.message,
          });
        }
      },
    },
});

export default userProxy;