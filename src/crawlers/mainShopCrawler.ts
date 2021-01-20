import BrowserManager from "../core/BrowserManager";
import Hepsiburada from '../shops/Hepsiburada';
import '../database';
import {IProduct} from "../interfaces/IProduct";

(async () => {
    let browserManager: BrowserManager = new BrowserManager();

    let browser = await browserManager.startBrowser();
    let page = await browser.newPage();

    let hepsi = new Hepsiburada();
    let categoryPageUri = 'https://www.hepsiburada.com/laptop-notebook-dizustu-bilgisayarlar-c-98'; // "Laptop"
    let desktopPCPageUri = 'https://www.hepsiburada.com/masaustu-bilgisayarlar-c-34'; // "Masaüstü Bilgisayar"
    let motherboardPageUri = 'https://www.hepsiburada.com/anakartlar-c-152'; // "Anakart"
    let shopProducts: IProduct[] = await hepsi.getProductsFromCategoryPage(motherboardPageUri, page);

    for (let shopProduct of shopProducts) {
        let _product: IProduct = await hepsi.getProductDetailFromProductPage(shopProduct.url, "Anakart", page);

        if (_product && _product.id && _product.id !== "") {
            _product.mainId = shopProduct.id;
            await hepsi.updateAndCreateProducts([_product], true);
        }
    }

    console.log("Finish");

    page.close();
    browserManager.destroyBrowser();

    process.exit();
})();