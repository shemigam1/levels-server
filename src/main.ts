// import express, { Request, Response } from "express";
import express, { Request, Response, NextFunction } from "express";
import { config } from "../utils/config";
// ============ CONFIG ============


const app = express();
app.use(express.json());

const provider = new ethers.JsonRpcProvider(config.RPC_URL);

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

});

// Error handling middleware
app.use((err: Error, req: Request, res: Response) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, error: "Internal server error" });
});

// Start server
app.listen(config.PORT, () => {
  console.log(
    `http://localhost:${config.PORT}`
  );
});
