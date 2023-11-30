"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: 'config.env' });
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const port = process.env.PORT;
const uri = process.env.URI;
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
