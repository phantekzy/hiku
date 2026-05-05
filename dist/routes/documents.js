"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const documentController_1 = require("../controllers/documentController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get("/", documentController_1.getDocuments);
router.get("/:id", documentController_1.getDocument);
router.post("/", documentController_1.createDocument);
router.patch("/:id", documentController_1.updateDocument);
router.delete("/:id", documentController_1.deleteDocument);
exports.default = router;
//# sourceMappingURL=documents.js.map