import {Browser, Page} from "puppeteer";

class PageManager {
    page: Page;

    async create(browser: Browser): Promise<Page> {
        if (this.page === undefined) {
            this.page = await browser.newPage();
            return this.page;
        }

        return null;
    }

    async destroy(): Promise<boolean> {
        let status: boolean = false;

        if (this.page !== undefined) {
            await this.page.close();
            status = true;
        }

        return status;
    }
}

export default PageManager;