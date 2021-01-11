import Gittigidiyor from "../../src/shops/Gittigidiyor";
import "../../src/database";

let gittigidiyor = new Gittigidiyor();

describe("Ürün detayı için 404 url verilince", () => {
    let data;

    beforeAll(async () => {
        data = await gittigidiyor.getProductDetailFromProductPage("https://n11sadasd.com/dasdsdsad", "Laptop", page);
    }, 30000);

    it('Ürün verisi NULL gelmeli', () => {
        expect(data).toBeNull();
    });
});

describe("Ürün detayı için alakasız url verilince", () => {
    let data;

    beforeAll(async () => {
        data = await gittigidiyor.getProductDetailFromProductPage("https://www.google.com.tr/", "Laptop", page);
    }, 30000);

    it('Ürün verisi NULL gelmeli', () => {
        expect(data).toBeNull();
    });
});

describe("İlk entegrasyon için test ürünü", () => {
    let data;

    beforeAll(async () => {
        data = await gittigidiyor.getProductDetailFromProductPage("https://www.gittigidiyor.com/dizustu-laptop-notebook-bilgisayar/asus-d509dj-ej120_spp_798167", "Laptop", page);
    }, 30000);

    it('Ürün verileri beklendiği gibi gelmeli ve kodlar hata vermemeli', () => {
        expect(data.id).toEqual("617978870");
        expect(data.name).toEqual("Asus D509DJ-EJ120 Dizüstü Bilgisayar (Laptop)");
        expect(data.attributes.filter(e => { return e.attributeName === "RAM" })[0].attributeValue).toEqual("8 GB");
        expect(data.attributes.filter(e => { return e.attributeName === "SSD" })[0].attributeValue).toEqual("256 GB");
    });
});

describe("Aranan ürün bulunamadığında", () => {
    let data;

    beforeAll(async () => {
        data = await gittigidiyor.getRelatedProductsFromSearching("saldasldjskladjaskldjasldkjasdklsajdlasdjl", "Laptop", page);
    }, 30000);

    it('Url verisi boş array gelmeli', () => {
        expect(data.length).toEqual(0);
    });
});