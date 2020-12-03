import * as puppeteer from "puppeteer";
import {Browser, Page} from "puppeteer";

class BrowserManager {
    browser: Browser;

    async startBrowser(): Promise<Browser> {
        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: false,
                defaultViewport: {
                    width: 1920,
                    height: 1080
                },
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                ],
            });
        }

        return this.browser;
    };

    async getFirstPage(): Promise<Page> {
        let pages = await this.browser.pages();

        if (pages.length > 0) {
            return pages[0];
        }

        return null;
    }

    async getBrowser(): Promise<Browser> {
        if (!this.browser)
            return await this.startBrowser();
        else
            return this.browser;
    };

    async destroyBrowser(): Promise<boolean> {
        let status = false;

        if (this.browser) {
            await this.browser.close();
            status = true;
        }

        return status;
    };
}

export default BrowserManager;