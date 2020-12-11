# Shop Crawler

## Abstract

Yeni eklenecek her mağaza(n11, hepsiburada vb) Shop classından extend edilmelidir. Oluşturulacak olan class yeni bir dosya içerisinde '`shops`' klasörü altına alınmalıdır. İçerisinde doldurulması gereken en önemli fonksiyonlar: "`getRelatedProductsFromSearching`", "`getProductDetailFromProductPage`". Bu fonksiyonların örnekleri '`shops/Hepsiburada.ts`' ve '`shops/n11.ts`' içerisinde bulunuyor. Fonksiyonun amacı ve aldığı parametrelerin ne oldukları ile ilgili bilgi almak için abstract class ın içerisinde fonksiyonlara ait Hint kısımları incelenebilir.

Shopların bazı tekil ve ufak değişkenleri bulunuyor. Bunlar `shopId`, `shopUrl` ve `shopName`.

`shopId` Diğer shoplardan da görebileceğimiz üzere mağazanın slug olarak yazılmış hali diyebiliriz.

`shopUrl` Mağaza URL'i

`shopName` Mağaza Adı

<br>

### Fonksiyonlar

Shop kendi içerisinde yardımcı fonksiyonlar barındırıyor. Fonksiyon Hintleri ile ne işe yaradıklarını rahatlıkla anlayabiliriz. Ancak burada tekrar hepsini gözden geçirelim.

Fonksiyon | Açıklama
--- | ---
checkAttrs | Ürünler farklı mağazardan çekilip eşleştirilme aşamasına geldiğinde direkt olarak `attributes` objesi altında bulunan özellikler ile karşılaştırmaya tabi olur. Bu fonksiyon iki ürünün attributelerini alarak eşleştiğine dair bir boolean objesi döndürür.
objectToProduct | verilen objeyi parçalayarak `IProduct` objesine çevirir.
arrayToProductList | verilen obje listesini parçalayarak `IProduct[]` objesine çevirir.
createShopProductFromProduct | verilen `IProduct` objesini `ShopProduct` objesine çevirir.
slugify | verilen text i slug a çevirir
sleep | puppeteer pageleri için bir duraklatma sağlar
getAllProductsFromDatabase | veritabanında bulunan tüm ürünleri çeker
getProductsFromDatabase | sadece Shop a ait ürünleri çeker

<br>
<br>

## Entities ve Models

'`./src/entities/`' klasörü altında veritabanında bulunacak obje verilerinin şemaları bulunuyor. 

`ShopProduct` ürünlerimizin bulunduğu, `ShopCategory` ise kategorilerimizin bulunduğu entity.

'`./src/models/`' klasörü altında işlemlerimizi gerçekleştirdiğimiz modellerimiz bulunuyor. `ShopProduct` içerisinde bulunan `subProducts` attribute u `Product` modellerini kapsayan bir array.

Bir ürün öncelikle main olarak eklenir '`ShopProduct`'. Ardından tüm Shop özellikleri ile birlite eklenen ürünün `subProducts` attribute üne eklenir.

Diğer mağazalardan eklenecek olan her ürün eşleşen bir main ürünü varsa o ürünün `subProducts` ına eklenir. Harici bir ürün olarak eklenmez. Bu şekilde ürün bütünlüğü sağlanmış olur.