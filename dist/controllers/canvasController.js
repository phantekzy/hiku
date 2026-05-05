"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCanvas = exports.updateCanvas = exports.createCanvas = exports.getCanvas = exports.getCanvases = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const updateSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200).optional(),
    data: zod_1.z.record(zod_1.z.unknown()).optional(),
    thumbnail: zod_1.z.string().optional(),
});
const getCanvases = async (req, res) => {
    try {
        const canvases = await prisma_1.prisma.canvas.findMany({
            where: { userId: req.user.id },
            orderBy: { updatedAt: "desc" },
            select: {
                id: true,
                title: true,
                thumbnail: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        res.json(canvases);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch canvases" });
    }
};
exports.getCanvases = getCanvases;
const getCanvas = async (req, res) => {
    try {
        const canvas = await prisma_1.prisma.canvas.findFirst({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!canvas) {
            res.status(404).json({ message: "Canvas not found" });
            return;
        }
        res.json(canvas);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch canvas" });
    }
};
exports.getCanvas = getCanvas;
const createCanvas = async (req, res) => {
    try {
        const canvas = await prisma_1.prisma.canvas.create({
            data: { userId: req.user.id, title: "Untitled Canvas", data: {} },
        });
        res.status(201).json(canvas);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create canvas" });
    }
};
exports.createCanvas = createCanvas;
const updateCanvas = async (req, res) => {
    try {
        const parsed = updateSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ message: parsed.error.errors[0].message });
            return;
        }
        const existing = await prisma_1.prisma.canvas.findFirst({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!existing) {
            res.status(404).json({ message: "Canvas not found" });
            return;
        }
        const updated = await prisma_1.prisma.canvas.update({
            where: { id: req.params.id },
            data: { ...parsed.data },
        });
        res.json(updated);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update canvas" });
    }
};
exports.updateCanvas = updateCanvas;
const deleteCanvas = async (req, res) => {
    try {
        const existing = await prisma_1.prisma.canvas.findFirst({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!existing) {
            res.status(404).json({ message: "Canvas not found" });
            return;
        }
        await prisma_1.prisma.canvas.delete({ where: { id: req.params.id } });
        res.status(204).send();
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete canvas" });
    }
};
exports.deleteCanvas = deleteCanvas;
//# sourceMappingURL=canvasController.js.map