import BrowserManager from "./core/BrowserManager";
import Hepsiburada from './shops/Hepsiburada';
import n11 from './shops/n11';
import './database';
import {IProduct} from "./interfaces/IProduct";
import ShopProduct, {IShopProduct} from "./entities/ShopProduct";

(async () => {
    let browserManager: BrowserManager = new BrowserManager();

    let browser = await browserManager.startBrowser();
    let page = await browser.newPage();

    let hepsi = new Hepsiburada();
    let nonbir = new n11();

    let categoryPageUri = 'https://www.hepsiburada.com/laptop-notebook-dizustu-bilgisayarlar-c-98';
    let shopProducts: IShopProduct[] = await hepsi.getAllProductsFromDatabase();

    for (let shopProduct of shopProducts) {
        let _product: IProduct[] = await nonbir.getRelatedProductsFromSearching(shopProduct.name, "Laptop", page);

        if (_product && _product[0].id !== "") {
            _product[0].mainId = shopProduct.id;
            await nonbir.updateAndCreateProducts(_product);
        }
    }

    console.log("Finish");

    page.close();
    browserManager.destroyBrowser();

    process.exit();
})();