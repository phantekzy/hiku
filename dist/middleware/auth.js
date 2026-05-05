"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "No token provided" });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret)
            throw new Error("JWT_SECRET not configured");
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            username: decoded.username,
        };
        next();
    }
    catch {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map