"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDiagram = exports.updateDiagram = exports.createDiagram = exports.getDiagram = exports.getDiagrams = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const updateSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200).optional(),
    data: zod_1.z
        .object({
        nodes: zod_1.z.array(zod_1.z.unknown()),
        edges: zod_1.z.array(zod_1.z.unknown()),
    })
        .optional(),
});
const getDiagrams = async (req, res) => {
    try {
        const diagrams = await prisma_1.prisma.diagram.findMany({
            where: { userId: req.user.id },
            orderBy: { updatedAt: "desc" },
            select: { id: true, title: true, createdAt: true, updatedAt: true },
        });
        res.json(diagrams);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch diagrams" });
    }
};
exports.getDiagrams = getDiagrams;
const getDiagram = async (req, res) => {
    try {
        const diagram = await prisma_1.prisma.diagram.findFirst({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!diagram) {
            res.status(404).json({ message: "Diagram not found" });
            return;
        }
        res.json(diagram);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch diagram" });
    }
};
exports.getDiagram = getDiagram;
const createDiagram = async (req, res) => {
    try {
        const diagram = await prisma_1.prisma.diagram.create({
            data: {
                userId: req.user.id,
                title: "Untitled Diagram",
                data: { nodes: [], edges: [] },
            },
        });
        res.status(201).json(diagram);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create diagram" });
    }
};
exports.createDiagram = createDiagram;
const updateDiagram = async (req, res) => {
    try {
        const parsed = updateSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ message: parsed.error.errors[0].message });
            return;
        }
        const existing = await prisma_1.prisma.diagram.findFirst({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!existing) {
            res.status(404).json({ message: "Diagram not found" });
            return;
        }
        const updated = await prisma_1.prisma.diagram.update({
            where: { id: req.params.id },
            data: { ...parsed.data },
        });
        res.json(updated);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update diagram" });
    }
};
exports.updateDiagram = updateDiagram;
const deleteDiagram = async (req, res) => {
    try {
        const existing = await prisma_1.prisma.diagram.findFirst({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!existing) {
            res.status(404).json({ message: "Diagram not found" });
            return;
        }
        await prisma_1.prisma.diagram.delete({ where: { id: req.params.id } });
        res.status(204).send();
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete diagram" });
    }
};
exports.deleteDiagram = deleteDiagram;
//# sourceMappingURL=diagramController.js.map