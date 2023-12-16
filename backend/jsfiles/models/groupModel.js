"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
const mongoose_1 = __importStar(require("mongoose"));
console.log('hello');
// Group Schema
const groupSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'A group must have a name'],
        unique: [true, 'A group with this name already exists.'],
    },
    creator: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'A group must have a creator'],
    },
    members: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Users',
        },
    ],
    messages: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Messages',
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
const Groups = mongoose_1.default.model('Groups', groupSchema);
module.exports = Groups;
