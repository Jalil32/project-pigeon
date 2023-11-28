"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const groupController_1 = require("./../controllers/groupController");
const router = express_1.default.Router();
router.route('/').get(groupController_1.getAllGroups).post(groupController_1.createGroup);
router
    .route('/:id')
    .get(groupController_1.getGroup)
    .patch(groupController_1.addGroupMember)
    .delete(groupController_1.deleteGroup);
module.exports = router;
