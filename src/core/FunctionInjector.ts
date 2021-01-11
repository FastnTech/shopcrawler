/**
 * Obje verilir. Element ise textContent i ini alıp döndürür
 * element değilse boş string döner
 * 
 * @param e Kontrol edilecek ve değeri alınacak olan element
 */
const getTextContentFromElement = (e: any): string => {
    return e ? e.textContent.trim() : '';
}

/**
 * Belirtilen attribute ü verilen objede arar. Obje
 * element değilse boş string döner. Attribute hep string döner
 * 
 * @param e Kontrol edilecek ve değeri alınacak olan element
 * @param attribute Alnınan elementten hangi attribute ün 
 * alınacağını belirtir
 */
const getAttributeFromElement = (e: any, attribute: string): string => {
    return e ? e.getAttribute(attribute).trim() : '';
}

/**
 * Element varsa textContent ini alıp içerisinden price bilgisini çeker
 * yoksa boş string döner
 * Price bilgisi herzaman string döner
 * Price değerlerinde kuruş için nokta değil virgül kullanıyoruz
 * 
 * @param e Kontrol edilecek ve değeri alınacak olan element
 */
const getPriceFromElement = (e: any): string => {
    return e ? e.textContent.replace(/[^0-9.,]/g, '').replace(/\./g, ',') : '';
}