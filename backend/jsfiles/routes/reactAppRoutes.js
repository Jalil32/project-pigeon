"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.route('/').get((req, res) => {
    //  res.status(200).sendFile("../client/index.html");
    res.sendFile(`${__dirname}/my-app/build/index.html`);
});
module.exports = router;
