const cicekSepetiGeneralizer = {
    "Laptop": (attrName: string, attrValue: string) => {
        if (attrName === "Ram (Sistem Belleği)") {
            attrName = "RAM";
            attrValue = attrValue.replace(/[^0-9]/g, '') + " GB";
        }

        if (attrName === "SSD Kapasitesi") {
            attrName = "SSD";
            attrValue = attrValue.replace(/[^0-9 TGBtgb]/g, '').toUpperCase().trim();
        }

        if (attrName === "Kapasite") {
            attrName = "HDD";
            attrValue = attrValue.replace(/[^0-9 TGBtgb]/g, '').toUpperCase().trim();
        }

        if (attrName === "İşlemci Tipi") {
            attrName = "İşlemci";
            attrValue = attrValue.toLocaleUpperCase();
        }

        if (attrName === "İşlemci Modeli") {
            attrName = "İşlemci Model";
            attrValue = attrValue.toLocaleUpperCase();
        }

        if (attrName === "Ekran Boyutu") {
            attrName = "Ekran Boyutu";
            attrValue = attrValue.split('-')[0].replace(/[^0-9.,]/g, '').replace(/,/g, '.');
        }

        return {
            attrName: attrName,
            attrValue: attrValue
        };
    },
}

const n11Generalizer = {
    "Laptop": (attrName: string, attrValue: string) => {
        if (attrName === "Ekran Kartı Belleği") {
            attrName = "Ekran Kartı Hafızası";
            attrValue = attrValue.replace(/[^0-9]/g, '') + " GB";
        }

        if (attrName === "Sistem Belleği (Gb)") {
            attrName = "RAM";
            attrValue = attrValue.replace(/[^0-9]/g, '') + " GB";
        }

        if (attrName === "SSD") {
            attrName = "SSD";
            attrValue = attrValue.replace(/[^0-9 TGBtgb]/g, '').toUpperCase().trim();
        }

        if (attrName === "Disk Kapasitesi") {
            attrName = "HDD";
            attrValue = attrValue.replace(/[^0-9 TGBtgb]/g, '').toUpperCase().trim();
        }

        if (attrName === "İşlemci") {
            attrName = "İşlemci";
            attrValue = attrValue.toLocaleUpperCase();
        }

        if (attrName === "İşlemci Modeli") {
            attrName = "İşlemci Model";
            attrValue = attrValue.toLocaleUpperCase();
        }

        if (attrName === "Ekran Boyutu") {
            attrName = "Ekran Boyutu";
            attrValue = attrValue.replace(/[^0-9.,]/g, '').replace(/,/g, '.');
        }

        return {
            attrName: attrName,
            attrValue: attrValue
        };
    },
}

const gittigidiyorGeneralizer = {
    "Laptop": (attrName: string, attrValue: string) => {
        if (attrName === "Bellek (RAM)") {
            attrName = "RAM";
            attrValue = attrValue.replace(/[^0-9]/g, '') + " GB";
        }

        if (attrName === "Sabit Disk (SSD) Boyutu") {
            attrName = "SSD";
            attrValue = attrValue.replace(/[^0-9 TGBtgb]/g, '').toUpperCase().trim();
        }

        if (attrName === "Sabit Disk (HDD) Boyutu") {
            attrName = "HDD";
            attrValue = attrValue.replace(/[^0-9 TGBtgb]/g, '').toUpperCase().trim();
        }

        if (attrName === "CPU Serisi") {
            attrName = "İşlemci";
            attrValue = attrValue.toLocaleUpperCase();
        }

        if (attrName === "CPU Modeli") {
            attrName = "İşlemci Model";
            attrValue = attrValue.toLocaleUpperCase();
        }

        if (attrName === "Ekran Boyutu") {
            attrName = "Ekran Boyutu";
            attrValue = attrValue.replace(/[^0-9.,]/g, '').replace(/,/g, '.');
        }

        return {
            attrName: attrName,
            attrValue: attrValue
        }
    }
}

const trendyolGeneralizer = {
    "Laptop": (attrName: string, attrValue: string) => {
        if (attrName === "Ram (Sistem Belleği)") {
            attrName = "RAM";
            attrValue = attrValue.replace(/[^0-9]/g, '') + " GB";
        }

        if (attrName === "SSD Kapasitesi") {
            attrName = "SSD";
            attrValue = attrValue.replace(/[^0-9 TGBtgb]/g, '').toUpperCase().trim();
        }

        if (attrName === "Kapasite") {
            attrName = "HDD";
            attrValue = attrValue.replace(/[^0-9 TGBtgb]/g, '').toUpperCase().trim();
        }

        if (attrName === "İşlemci Tipi") {
            attrName = "İşlemci";
            attrValue = attrValue.toLocaleUpperCase();
        }

        if (attrName === "İşlemci Modeli") {
            attrName = "İşlemci Model";
            attrValue = attrValue.toLocaleUpperCase();
        }

        if (attrName === "Ekran Boyutu") {
            attrName = "Ekran Boyutu";
            attrValue = attrValue.replace(/[^0-9.,]/g, '').replace(/,/g, '.');
        }

        return {
            attrName: attrName,
            attrValue: attrValue
        }
    }
}

const hepsiburadaGeneralizer = {
    "Laptop": (attrName: string, attrValue: string) => {
        if (attrName === "Bellek Hızı") {
            attrName = "RAM Hızı";
            attrValue = attrValue.replace(/[^0-9]/g, '') + " MHZ";
        }

        if (attrName === "Ekran Kartı Hafızası") {
            attrName = "Ekran Kartı Hafızası";
            attrValue = attrValue.replace(/[^0-9]/g, '') + " GB";
        }

        if (attrName === "Ram (Sistem Belleği)") {
            attrName = "RAM";
            attrValue = attrValue.replace(/[^0-9]/g, '') + " GB";
        }

        if (attrName === "SSD Kapasitesi") {
            attrName = "SSD";
            attrValue = attrValue.replace(/[^0-9 TGBtgb]/g, '').toUpperCase().trim();
        }

        if (attrName === "Harddisk Kapasitesi") {
            attrName = "HDD";
            attrValue = attrValue.replace(/[^0-9 TGBtgb]/g, '').toUpperCase().trim();
        }

        if (attrName === "İşlemci") {
            attrName = "İşlemci Model";
            attrValue = attrValue.toLocaleUpperCase();
        }

        if (attrName === "İşlemci Tipi") {
            attrName = "İşlemci";
            attrValue = attrValue.toLocaleUpperCase();
        }

        if (attrName === "Ekran Boyutu") {
            attrName = "Ekran Boyutu";
            attrValue = attrValue.replace(/[^0-9.,]/g, '').replace(/,/g, '.');
        }

        return {
            attrName: attrName,
            attrValue: attrValue
        }
    }
}