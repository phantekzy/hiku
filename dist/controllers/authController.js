"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    username: zod_1.z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be at most 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(1, "Password is required"),
});
function signToken(payload) {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
}
const register = async (req, res) => {
    try {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ message: parsed.error.errors[0].message });
            return;
        }
        const { email, username, password } = parsed.data;
        const existingEmail = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (existingEmail) {
            res.status(409).json({ message: "Email already in use" });
            return;
        }
        const existingUsername = await prisma_1.prisma.user.findUnique({
            where: { username },
        });
        if (existingUsername) {
            res.status(409).json({ message: "Username already taken" });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const user = await prisma_1.prisma.user.create({
            data: { email, username, password: hashedPassword },
            select: { id: true, email: true, username: true, createdAt: true },
        });
        const token = signToken({
            id: user.id,
            email: user.email,
            username: user.username,
        });
        res.status(201).json({ token, user });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during registration" });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ message: parsed.error.errors[0].message });
            return;
        }
        const { email, password } = parsed.data;
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const isValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const token = signToken({
            id: user.id,
            email: user.email,
            username: user.username,
        });
        const { password: _, ...safeUser } = user;
        res.json({ token, user: safeUser });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during login" });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                username: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getMe = getMe;
//# sourceMappingURL=authController.js.map