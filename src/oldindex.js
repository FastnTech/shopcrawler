
//let hepsi = new Hepsiburada();
// let categories = await hepsi.getCategoriesFromMainPage(page);
// await hepsi.updateAndCreateCategories(categories);

// let categories = await hepsi.getCategoriesFromDatabase();

// for (let category of categories) {
//     let products = await hepsi.getProductsFromCategoryPage(category.url, page);

//     await hepsi.updateAndCreateProducts(products, category.id);
// }


// let categories = await n11shop.getCategoriesFromMainPage(page);
// await n11shop.updateAndCreateCategories(categories);
//---------------------------------------
// let n11shop = new n11();

// let categories = await n11shop.getCategoriesFromDatabase();

// for (let category of categories) {
//     let products = await n11shop.getProductsFromCategoryPage(category.url, page);

//     await n11shop.updateAndCreateProducts(products, category.id);
// }

// let hepsi = new Hepsiburada();
// let nonbir = new n11();
// let hepsiProducts = await hepsi.getProductsFromDatabase();

// for (let hepsiProduct of hepsiProducts) {
//     let products = await nonbir.getRelatedProductsFromSearching(hepsiProduct.name, page);

//     if (products.length > 0) {
//         let ids = products.map((p) => { return p.id; });

//         if (hepsiProduct.subProducts) {
//             hepsiProduct.subProducts = hepsiProduct.subProducts.concat(ids);
//         } else {
//             hepsiProduct.subProducts = ids;
//         }

//         await hepsiProduct.save();
//     }

//     await nonbir.updateAndCreateProducts(products, hepsiProduct.categoryId);
// }