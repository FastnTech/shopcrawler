import CicekSepeti from "../../src/shops/CicekSepeti";

let ciceksepeti = new CicekSepeti();

describe("Ürün detayı için 404 url verilince", () => {
    let data;

    beforeAll(async () => {
        data = await ciceksepeti.getProductDetailFromProductPage("https://n11sadasd.com/dasdsdsad", "Laptop", page);
    }, 30000);

    it('Ürün verisi NULL gelmeli', () => {
        expect(data).toBeNull();
    });
});

describe("Ürün detayı için alakasız url verilince", () => {
    let data;

    beforeAll(async () => {
        data = await ciceksepeti.getProductDetailFromProductPage("https://www.google.com.tr/", "Laptop", page);
    }, 30000);

    it('Ürün verisi NULL gelmeli', () => {
        expect(data).toBeNull();
    });
});

describe("Out-Of-Stock Ürün", () => {
    let data;

    beforeAll(async () => {
        data = await ciceksepeti.getProductDetailFromProductPage("https://www.ciceksepeti.com/asus-x515ja-br070t10-i3-1005g1-36gb-512ssd-w10h-15.6-tasinabilir-bilgisayar-kc8041140", "Laptop", page);
    }, 30000);

    it('Ürün verisi NULL gelmeli', () => {
        expect(data).toBeNull();
    });
});

describe("İlk entegrasyon için test ürünü", () => {
    let data;

    beforeAll(async () => {
        data = await ciceksepeti.getProductDetailFromProductPage("https://www.ciceksepeti.com/asus-e410ma-bv185tz1-intel-celeron-n4020-4gb-256gb-ssd-win10-home-14-kc3611090", "Laptop", page);
    }, 30000);

    it('Ürün verileri beklendiği gibi gelmeli ve kodlar hata vermemeli', () => {
        expect(data.name).toEqual(`Asus E410MA-BV185TZ1 Intel Celeron N4020 4GB 256GB SSD Win10 Home 14\"`);
        expect(data.attributes.filter(e => { return e.attributeName === "RAM" })[0].attributeValue).toEqual("4 GB");
        expect(data.attributes.filter(e => { return e.attributeName === "SSD" })[0].attributeValue).toEqual("256 GB");
    });
});