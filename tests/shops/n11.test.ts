import n11 from "../../src/shops/n11";

let nonbir = new n11();

describe("Ürün detayı için 404 url verilince", () => {
    let data;

    beforeAll(async () => {
        data = await nonbir.getProductDetailFromProductPage("https://n11sadasd.com/dasdsdsad", "Laptop", page);
    }, 30000);

    it('Ürün verisi NULL gelmeli', () => {
        expect(data).toBeNull();
    });
});

describe("Ürün detayı için alakasız url verilince", () => {
    let data;

    beforeAll(async () => {
        data = await nonbir.getProductDetailFromProductPage("https://www.google.com.tr/", "Laptop", page);
    }, 30000);

    it('Ürün verisi NULL gelmeli', () => {
        expect(data).toBeNull();
    });
});

describe("Ürün detayı için outofstock url verilince", () => {
    let data;

    beforeAll(async () => {
        data = await nonbir.getProductDetailFromProductPage("https://urun.n11.com/tasinabilir-sarj-cihazi/ravpower-rp-pb003-15000mah-ipx4-outdoor-gunes-enerjili-ve-led-isi-P437534382", "", page);
    }, 30000);

    it('Ürün verisi NULL gelmeli', () => {
        expect(data).toBeNull();
    });
});

describe("Aranan ürün bulunamadığında", () => {
    let data;

    beforeAll(async () => {
        data = await nonbir.getRelatedProductsFromSearching("saldasldjskladjaskldjasldkjasdklsajdlasdjl", "Laptop", page);
    }, 30000);

    it('Url verisi boş array gelmeli', () => {
        expect(data.length).toEqual(0);
    });
});