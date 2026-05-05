"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const diagramController_1 = require("../controllers/diagramController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get("/", diagramController_1.getDiagrams);
router.get("/:id", diagramController_1.getDiagram);
router.post("/", diagramController_1.createDiagram);
router.patch("/:id", diagramController_1.updateDiagram);
router.delete("/:id", diagramController_1.deleteDiagram);
exports.default = router;
//# sourceMappingURL=diagrams.js.map