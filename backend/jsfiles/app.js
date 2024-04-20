"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const groupRoutes_1 = __importDefault(require("./routes/groupRoutes"));
const reactAppRoutes_1 = __importDefault(require("./routes/reactAppRoutes"));
const morgan_1 = __importDefault(require("morgan"));
const appError_1 = __importDefault(require("./utils/appError"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const app = (0, express_1.default)();
// MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, 'my-app', 'build')));
// ROUTES
app.use('/', reactAppRoutes_1.default);
app.use('/api/v1/user', userRoutes_1.default);
app.use('/api/v1/group', groupRoutes_1.default);
app.all('*', (req, _res, next) => {
    next(new appError_1.default(`Can't find ${req.url} on this server!`, 404));
});
// GLOBAL ERROR HANDLER
// This is called if any value is passed to next anywhere in the application
app.use(errorController_1.default);
module.exports = app;
