import path from "path";
import puppeteer, { Browser, BrowserContext, Page } from "puppeteer";

interface Pages {
	[key: string]: Page;
}

interface Contexts {
	[key: string]: BrowserContext;
}

let pages: Pages = {};
let contexts: Contexts = {};

let browser: Browser;
let bufferContext: BrowserContext;
let bufferPage: Page;
let searchPage: Page;

let delay = function (time: number) {
	return new Promise((resolve) => setTimeout(resolve, time));
};

let helperLocation = path.join(__dirname, "..", "helpers/GSTAPI.js");

puppeteer
	.launch({
		args: [
			"--no-sandbox",
			"--disable-web-security",
			"--disable-setuid-sandbox",
			"--disable-dev-shm-usage",
			"--disable-accelerated-2d-canvas",
			"--no-first-run",
			"--no-zygote",
			"--disable-gpu",
		],
		headless: true,
	})
	.then(async (bro) => {
		browser = bro;
		// Initialization of search page
		bufferContext = await browser.createIncognitoBrowserContext();
		searchPage = await bufferContext.newPage();
		await searchPage.setUserAgent(
			"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
		);
		await searchPage.setBypassCSP(true);
		await searchPage.goto("https://services.gst.gov.in/services/login");
		await searchPage.addScriptTag({
			path: require.resolve(helperLocation),
		});

		// Initialization of buffer page
		bufferContext = await browser.createIncognitoBrowserContext();
		bufferPage = await bufferContext.newPage();
		await bufferPage.setUserAgent(
			"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
		);
		await bufferPage.setBypassCSP(true);
		await bufferPage.goto("https://services.gst.gov.in/services/login");
		console.log("Browser is ready to use...");
	});

export default class PuppetService {
	public static async start(id: string) {
		if (!pages[id] || pages[id] == null) {
			await bufferPage.addScriptTag({
				path: require.resolve(helperLocation),
			});
			if (Object.keys(pages).length > 15) {
				var temp = Object.keys(pages)[0];
				pages[temp]?.close().catch((err) => {});
				delete pages[temp];
			}
			contexts[id] = bufferContext;
			pages[id] = bufferPage;
			return { index: id };
		} else {
			return { index: id };
		}
	}

	public static async prepNext() {
		bufferContext = await browser.createIncognitoBrowserContext();
		bufferPage = await bufferContext.newPage();
		await bufferPage.setUserAgent(
			"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
		);
		await bufferPage.setBypassCSP(true);
		await bufferPage.goto("https://services.gst.gov.in/services/login");
		return true;
	}

	public static async captcha(id: string) {
		const page = pages[id];
		let data = await page
			.evaluate("refreshCaptcha()")
			.catch((err) => {
				return false;
			});
		if (data !== false) {
			await page.waitForSelector("#imgCaptcha");
			await delay(1400);
			let captcha = await page
				.waitForSelector("#imgCaptcha")
				.then((element) => {
					return element;
				})
				.catch(() => {
					return null;
				});
			const image = await captcha?.screenshot({
				path:
					path.join(
						__dirname,
						"..",
						"..",
						"..",
						"static/public",
						"uploads"
					) +
					"/" +
					id +
					".png",
			});
			data = image;
		}
		return data;
	}
}
