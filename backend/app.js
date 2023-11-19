"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const nanoid_1 = require("nanoid");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = 3000;
const groups = JSON.parse(fs_1.default.readFileSync(`${__dirname}/mock-database/groups.json`, 'utf-8'));
// Create group
app.post('/createGroup', (req, res) => {
    let UGID = (0, nanoid_1.nanoid)();
    console.log(UGID);
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
