import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origin.startsWith("http://localhost")) return callback(null, true);
      if (origin.endsWith(".vercel.app")) return callback(null, true);
      if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: ${origin} not allowed`));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    database: process.env.DATABASE_URL ? "configured" : "missing",
  });
});

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found", path: req.path });
});

app.use(errorHandler);

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`\n🌿 Hiku running on http://localhost:${PORT}`);
    console.log(`   API: http://localhost:${PORT}/api\n`);
  });
}

export default app;
