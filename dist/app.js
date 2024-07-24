"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const scraper_1 = require("./Controller/scraper");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("api is running :)");
});
app.get("/api/webscraper", scraper_1.Scraper);
app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
