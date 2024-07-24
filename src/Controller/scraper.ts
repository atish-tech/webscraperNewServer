import puppeteer, { Browser, HTTPResponse, Page } from "puppeteer";
import { HTTPRequest } from "puppeteer";
import { WebPageData } from "../Utils/InterfaceType";
import { INCLUDED_RESOURCE_TYPE } from "../Utils/WebScrapperContants";
import { Request, Response } from "express";

export async function Scraper(request: Request, response: Response) {
  const path: string = request.query.path as string;
  const domainName: string = request.query.domainName as string;
  const url: string = decodeURIComponent(`http://${domainName}/${path}`);

  const browser: Browser = await puppeteer.launch();
  const page: Page = await browser.newPage();

  const userAgent: string = request.get("user-agent") as string;
  await page.setUserAgent(userAgent);

  await page.setRequestInterception(true);

  let pageData: WebPageData[] = [];

  page.on("request", (req: HTTPRequest) => {
    const url: URL = new URL(req.url());
    if (
      !INCLUDED_RESOURCE_TYPE.includes(req.resourceType()) ||
      url.hostname !== domainName
    ) {
      return req.abort();
    }
    req.continue();
  });

  page.on("response", async (response: HTTPResponse) => {
    let temp: WebPageData = {
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
      temp.responseText = await response.text();
    } catch (error: object | any) {
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
  });

  try {
    await page.goto(url);
  } catch (error) {
    console.error("Navigation failed:", error);
  }

  await browser.close();

  response.status(200).json({ val: pageData });
}
