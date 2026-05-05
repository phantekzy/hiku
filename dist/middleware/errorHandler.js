"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    if (process.env.NODE_ENV === "development") {
        console.error(`[Error] ${statusCode}: ${message}`);
        console.error(err.stack);
    }
    res.status(statusCode).json({
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map