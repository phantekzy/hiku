"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (origin.startsWith("http://localhost"))
            return callback(null, true);
        if (origin.endsWith(".vercel.app"))
            return callback(null, true);
        if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) {
            return callback(null, true);
        }
        return callback(new Error(`CORS: ${origin} not allowed`));
    },
    credentials: true,
}));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
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
app.use("/api", routes_1.default);
app.use((req, res) => {
    res.status(404).json({ message: "Route not found", path: req.path });
});
app.use(errorHandler_1.errorHandler);
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`\n🌿 Hiku running on http://localhost:${PORT}`);
        console.log(`   API: http://localhost:${PORT}/api\n`);
    });
}
exports.default = app;
//# sourceMappingURL=index.js.map