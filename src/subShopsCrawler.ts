import './database';
import PageManager from "./core/PageManager";
import BrowserManager from "./core/BrowserManager";
import {IProduct} from "./interfaces/IProduct";
import {IShopProduct} from "./entities/ShopProduct";
import Shop from './abstract/Shop';
import Hepsiburada from './shops/Hepsiburada';
import n11 from './shops/n11';
import Trendyol from './shops/Trendyol';
import Gittigidiyor from './shops/Gittigidiyor';
import CicekSepeti from './shops/CicekSepeti';

(async () => {
    let browserManager: BrowserManager = new BrowserManager();
    let pageManager: PageManager = new PageManager();

    let browser = await browserManager.startBrowser();
    let page = await pageManager.create(browser);

    let categories = [
        "Laptop"
    ];
    let hepsi = new Hepsiburada();

    for (let category of categories) {
        let mainShopProducts: IShopProduct[] = await hepsi.getProductsByCategory(category);

        let nonbir = new n11();
        let trendyol = new Trendyol();
        let gittigidiyor = new Gittigidiyor();
        let ciceksepeti = new CicekSepeti();

        let shops: Shop[] = [
            ciceksepeti,
            gittigidiyor,
            trendyol,
            nonbir,
        ];

        for (let i = 0; i < shops.length; i++) {
            let shop: Shop = shops[i];

            for (let shopProduct of mainShopProducts) {
                let _products: IProduct[] = await shop.getRelatedProductsFromSearching(shopProduct.name, category, page);

                for (let product of _products) {
                    if (product && typeof product["id"] !== "undefined" && product["id"] !== "") {
                        product.mainId = shopProduct.id;
                        await shop.updateAndCreateProducts([product]);
                    }
                }
            }
        }
    }

    console.log("Crawl Finished");

    page.close();
    browserManager.destroyBrowser();

    process.exit();
})();