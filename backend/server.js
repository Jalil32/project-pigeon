"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config({ path: 'config.env' });
const port = process.env.PORT ?? '3000';
const uri = process.env.URI ?? '';
mongoose_1.default
    .connect(uri, { dbName: 'project-pigeon' })
    .then(() => {
    console.log('Successfully connected to database\n');
})
    .catch((err) => {
    console.log('Failed to connect to database: ' + err);
});
app_1.default.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
