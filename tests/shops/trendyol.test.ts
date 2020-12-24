import Trendyol from "../../src/shops/Trendyol";
import "../../src/database";

let trendyol = new Trendyol();

describe("Ürün detayı için 404 url verilince", () => {
    let data;

    beforeAll(async () => {
        data = await trendyol.getProductDetailFromProductPage("https://n11sadasd.com/dasdsdsad", "Laptop", page);
    });

    it('Ürün verisi NULL gelmeli', () => {
        expect(data).toBeNull();
    });
});

describe("Ürün detayı için alakasız url verilince", () => {
    let data;

    beforeAll(async () => {
        data = await trendyol.getProductDetailFromProductPage("https://www.google.com.tr/", "Laptop", page);
    });

    it('Ürün verisi NULL gelmeli', () => {
        expect(data).toBeNull();
    });
});