"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const canvasController_1 = require("../controllers/canvasController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get("/", canvasController_1.getCanvases);
router.get("/:id", canvasController_1.getCanvas);
router.post("/", canvasController_1.createCanvas);
router.patch("/:id", canvasController_1.updateCanvas);
router.delete("/:id", canvasController_1.deleteCanvas);
exports.default = router;
//# sourceMappingURL=canvases.js.map