"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const groupRoutes_1 = __importDefault(require("./routes/groupRoutes"));
const reactAppRoutes_1 = __importDefault(require("./routes/reactAppRoutes"));
const app = (0, express_1.default)();
// MIDDLEWARE
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, 'my-app', 'build')));
// ROUTES
app.use('/', reactAppRoutes_1.default);
app.use('/api/v1/user', userRoutes_1.default);
app.use('/api/v1/group', groupRoutes_1.default);
module.exports = app;
