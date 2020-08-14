import BrowserManager from "./core/BrowserManager";
import Hepsiburada from './shops/Hepsiburada';
import './database';

(async () => {
    let browserManager: BrowserManager = new BrowserManager();

    let browser = await browserManager.startBrowser();
    let page = await browser.newPage();

    let hepsi = new Hepsiburada();
    // let categories = await hepsi.getCategoriesFromMainPage(page);
    // await hepsi.updateAndCreateCategories(categories);

    let categories = await hepsi.getCategoriesFromDatabase();

    for (let category of categories) {
        let products = await hepsi.getProductsFromCategoryPage(category.url, page);

        await hepsi.updateAndCreateProducts(products, category.id);
    }

    console.log("Finish");

    page.close();
    browserManager.destroyBrowser();

    process.exit();
})();