"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocument = exports.updateDocument = exports.createDocument = exports.getDocument = exports.getDocuments = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const upsertSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200).optional(),
    content: zod_1.z.record(zod_1.z.unknown()).optional(),
});
const getDocuments = async (req, res) => {
    try {
        const docs = await prisma_1.prisma.document.findMany({
            where: { userId: req.user.id },
            orderBy: { updatedAt: "desc" },
            select: { id: true, title: true, createdAt: true, updatedAt: true },
        });
        res.json(docs);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch documents" });
    }
};
exports.getDocuments = getDocuments;
const getDocument = async (req, res) => {
    try {
        const doc = await prisma_1.prisma.document.findFirst({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!doc) {
            res.status(404).json({ message: "Document not found" });
            return;
        }
        res.json(doc);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch document" });
    }
};
exports.getDocument = getDocument;
const createDocument = async (req, res) => {
    try {
        const doc = await prisma_1.prisma.document.create({
            data: { userId: req.user.id, title: "Untitled Document", content: {} },
        });
        res.status(201).json(doc);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create document" });
    }
};
exports.createDocument = createDocument;
const updateDocument = async (req, res) => {
    try {
        const parsed = upsertSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ message: parsed.error.errors[0].message });
            return;
        }
        const existing = await prisma_1.prisma.document.findFirst({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!existing) {
            res.status(404).json({ message: "Document not found" });
            return;
        }
        const updated = await prisma_1.prisma.document.update({
            where: { id: req.params.id },
            data: { ...parsed.data },
        });
        res.json(updated);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update document" });
    }
};
exports.updateDocument = updateDocument;
const deleteDocument = async (req, res) => {
    try {
        const existing = await prisma_1.prisma.document.findFirst({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!existing) {
            res.status(404).json({ message: "Document not found" });
            return;
        }
        await prisma_1.prisma.document.delete({ where: { id: req.params.id } });
        res.status(204).send();
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete document" });
    }
};
exports.deleteDocument = deleteDocument;
//# sourceMappingURL=documentController.js.map