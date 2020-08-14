import BrowserManager from "./core/BrowserManager";
import Hepsiburada from './shops/Hepsiburada';
import './database';

(async () => {
    let browserManager: BrowserManager = new BrowserManager();

    await browserManager.startBrowser();
    let page = await browserManager.getFirstPage();

    let hepsi = new Hepsiburada();
    let categories = await hepsi.getCategoriesFromMainPage(page);
    await hepsi.updateAndCreateCategories(categories);

    //let products = await hepsi.getProductsFromCategoryPage("https://www.hepsiburada.com/laptop-notebook-dizustu-bilgisayarlar-c-98", page);

    page.close();
    browserManager.destroyBrowser();
})();