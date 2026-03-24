import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";

const paymentProxy = createProxyMiddleware({
  target: process.env.PAYMENT_SERVICE || "https://payment-service-861717114034.asia-southeast1.run.app",
  changeOrigin: true,
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

export default paymentProxy;