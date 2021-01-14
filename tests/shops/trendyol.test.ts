import Trendyol from "../../src/shops/Trendyol";

let trendyol = new Trendyol();

describe("Ürün detayı için 404 url verilince", () => {
    let data;

    beforeAll(async () => {
        data = await trendyol.getProductDetailFromProductPage("https://n11sadasd.com/dasdsdsad", "Laptop", page);
    }, 30000);

    it('Ürün verisi NULL gelmeli', () => {
        expect(data).toBeNull();
    });
});

describe("Ürün detayı için alakasız url verilince", () => {
    let data;

    beforeAll(async () => {
        data = await trendyol.getProductDetailFromProductPage("https://www.google.com.tr/", "Laptop", page);
    }, 30000);

    it('Ürün verisi NULL gelmeli', () => {
        expect(data).toBeNull();
    });
});

describe("Ürün detayı için outofstock url verilince", () => {
    let data;

    beforeAll(async () => {
        data = await trendyol.getProductDetailFromProductPage("https://www.trendyol.com/mavi/erkek-jake-mavi-premium-jean-0042228216-p-4406554", "", page);
    }, 30000);

    it('Ürün verisi NULL gelmeli', () => {
        expect(data).toBeNull();
    });
});

describe("Aranan ürün bulunamadığında", () => {
    let data;

    beforeAll(async () => {
        data = await trendyol.getRelatedProductsFromSearching("saldasldjskladjaskldjasldkjasdklsajdlasdjl", "Laptop", page);
    }, 30000);

    it('Url verisi boş array gelmeli', () => {
        expect(data.length).toEqual(0);
    });
});