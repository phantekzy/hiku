"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const documents_1 = __importDefault(require("./documents"));
const canvases_1 = __importDefault(require("./canvases"));
const diagrams_1 = __importDefault(require("./diagrams"));
const router = (0, express_1.Router)();
router.use("/auth", auth_1.default);
router.use("/documents", documents_1.default);
router.use("/canvases", canvases_1.default);
router.use("/diagrams", diagrams_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map