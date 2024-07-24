"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scraper = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const WebScrapperContants_1 = require("../Utils/WebScrapperContants");
function Scraper(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const path = request.query.path;
        const domainName = request.query.domainName;
        const url = decodeURIComponent(`http://${domainName}/${path}`);
        const browser = yield puppeteer_1.default.launch();
        const page = yield browser.newPage();
        const userAgent = request.get("user-agent");
        yield page.setUserAgent(userAgent);
        yield page.setRequestInterception(true);
        let pageData = [];
        page.on("request", (req) => {
            const url = new URL(req.url());
            if (!WebScrapperContants_1.INCLUDED_RESOURCE_TYPE.includes(req.resourceType()) ||
                url.hostname !== domainName) {
                return req.abort();
            }
            req.continue();
        });
        page.on("response", (response) => __awaiter(this, void 0, void 0, function* () {
            let temp = {
                url: "",
                resourceType: "",
                responseText: "",
                initiator: "",
                headers: "",
                method: "",
                postData: "",
                statusCode: 0,
                error: "",
            };
            try {
                temp.responseText = yield response.text();
            }
            catch (error) {
                temp.error = error.message;
            }
            temp.statusCode = response.status();
            temp.url = response.url();
            temp.resourceType = response.request().resourceType();
            temp.method = response.request().method();
            temp.postData = response.request().postData() || "";
            temp.headers = JSON.stringify(response.request().headers());
            temp.initiator = JSON.stringify(response.request().initiator()) || "";
            pageData.push(temp);
        }));
        try {
            yield page.goto(url);
        }
        catch (error) {
            console.error("Navigation failed:", error);
        }
        yield browser.close();
        response.status(200).json({ val: pageData });
    });
}
exports.Scraper = Scraper;
