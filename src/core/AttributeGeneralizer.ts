const ATTR_RAM = "RAM";
const ATTR_HDD = "HDD";
const ATTR_SSD = "SSD";
const ATTR_CPU = "İşlemci";
const ATTR_CPU_MODEL = "İşlemci Model";
const ATTR_CPU_SPEED = "İşlemci Hızı";
const ATTR_SCREEN_SIZE = "Ekran Boyutu";
const ATTR_GPU_MODEL = "Ekran Kartı Modeli";
const ATTR_GPU_MEMORY = "Ekran Kartı Hafızası";
const ATTR_RAM_SPEED = "RAM Hızı";
const ATTR_RAM_SLOT = "Bellek Yuvası";
const ATTR_RAM_MAX = "Ram Kapasitesi";
const ATTR_RAM_TYPE = "Ram Tipi";
const ATTR_HDD_SPEED = "HDD Hızı";
const ATTR_PSU = "PSU";

const cicekSepetiGeneralizer = {
    "Laptop": (attrName, attrValue) => {
        if (attrName === "Ram (Sistem Belleği)") {
            attrName = ATTR_RAM;
            attrValue = attrValue.replace(/[^0-9]/g, '') + " GB";
        }

        if (attrName === "SSD Kapasitesi") {
            attrName = ATTR_SSD;
            attrValue = attrValue.replace(/[^0-9 TGBtgb]/g, '').toUpperCase().trim();
        }

        if (attrName === "Kapasite") {
            attrName = ATTR_HDD;
            attrValue = attrValue.replace(/[^0-9 TGBtgb]/g, '').toUpperCase().trim();
        }

        if (attrName === "İşlemci Tipi") {
            attrName = ATTR_CPU;
            attrValue = attrValue.toLocaleUpperCase();
        }

        if (attrName === "İşlemci Modeli") {
            attrName = ATTR_CPU_MODEL;
            attrValue = attrValue.toLocaleUpperCase();
        }

        if (attrName === "Ekran Boyutu") {
            attrName = ATTR_SCREEN_SIZE;
            attrValue = attrValue.split('-')[0].replace(/[^0-9.,]/g, '').replace(/,/g, '.');
        }

        return {
            attrName: attrName,
            attrValue: attrValue
        };
    },
}

const n11Generalizer = {
    "Laptop": (attrName, attrValue) => {
        if (attrName === "Ekran Kartı Belleği") {
            attrName = ATTR_GPU_MEMORY;
            attrValue = attrValue.replace(/[^0-9]/g, '') + " GB";
        }

        if (attrName === "Sistem Belleği (Gb)") {
            attrName = ATTR_RAM;
            attrValue = attrValue.replace(/[^0-9]/g, '') + " GB";
        }

        if (attrName === "SSD") {
            attrName = ATTR_SSD;
            attrValue = attrValue.replace(/[^0-9 TGBtgb]/g, '').toUpperCase().trim();
        }

        if (attrName === "Disk Kapasitesi") {
            attrName = ATTR_HDD;
            attrValue = attrValue.replace(/[^0-9 TGBtgb]/g, '').toUpperCase().trim();
        }

        if (attrName === "İşlemci") {
            attrName = ATTR_CPU;
            attrValue = attrValue.toLocaleUpperCase();
        }

        if (attrName === "İşlemci Modeli") {
            attrName = ATTR_CPU_MODEL;
            attrValue = attrValue.toLocaleUpperCase();
        }

        if (attrName === "Ekran Boyutu") {
            attrName = ATTR_SCREEN_SIZE;
            attrValue = attrValue.replace(/[^0-9.,]/g, '').replace(/,/g, '.');
        }

        return {
            attrName: attrName,
            attrValue: attrValue
        };
    },
}

const gittigidiyorGeneralizer = {
    "Laptop": (attrName, attrValue) => {
        if (attrName === "Bellek (RAM)") {
            attrName = ATTR_RAM;
            attrValue = attrValue.replace(/[^0-9]/g, '') + " GB";
        }

        if (attrName === "Sabit Disk (SSD) Boyutu") {
            attrName = ATTR_SSD;
            attrValue = attrValue.replace(/[^0-9 TGBtgb]/g, '').toUpperCase().trim();
        }

        if (attrName === "Sabit Disk (HDD) Boyutu") {
            attrName = ATTR_HDD;
            attrValue = attrValue.replace(/[^0-9 TGBtgb]/g, '').toUpperCase().trim();
        }

        if (attrName === "CPU Serisi") {
            attrName = ATTR_CPU;
            attrValue = attrValue.toLocaleUpperCase();
        }

        if (attrName === "CPU Modeli") {
            attrName = ATTR_CPU_MODEL;
            attrValue = attrValue.toLocaleUpperCase();
        }

        if (attrName === "Ekran Boyutu") {
            attrName = ATTR_SCREEN_SIZE;
            attrValue = attrValue.replace(/[^0-9.,]/g, '').replace(/,/g, '.');
        }

        return {
            attrName: attrName,
            attrValue: attrValue
        }
    },
    "Masaüstü Bilgisayar": (attrName, attrValue) => {
        if (attrName === "Bellek Türü") {
            attrName = ATTR_RAM_TYPE;
            attrValue = attrValue.trim();
        }

        if (attrName === "Ekran Kartı Markası") {
            attrName = ATTR_GPU_MODEL;
            attrValue = attrValue.trim();
        }

        if (attrName === "Ekran Kartı Bellek Miktarı") {
            attrName = ATTR_GPU_MEMORY;
            attrValue = attrValue.replace(/[^0-9]/g, '') + " GB";
        }

        if (attrName === "Bellek (RAM)") {
            attrName = ATTR_RAM;
            attrValue = attrValue.replace(/[^0-9]/g, '') + " GB";
        }

        if (attrName === "Sabit Disk (SSD) Boyutu") {
            attrName = ATTR_SSD;
            attrValue = attrValue.replace(/[^0-9 TGBtgb]/g, '').toUpperCase().trim();
        }

        if (attrName === "İşlemci Serisi") {
            attrName = ATTR_CPU;
            attrValue = attrValue.toLocaleUpperCase();
        }

        if (attrName === "Sabit Disk (HDD) Boyutu") {
            attrName = ATTR_HDD;
            attrValue = attrValue.toLocaleUpperCase();
        }

        return {
            attrName: attrName,
            attrValue: attrValue
        }
    }
}

const trendyolGeneralizer = {
    "Laptop": (attrName, attrValue) => {
        if (attrName === "Ram (Sistem Belleği)") {
            attrName = ATTR_RAM;
            attrValue = attrValue.replace(/[^0-9]/g, '') + " GB";
        }

        if (attrName === "SSD Kapasitesi") {
            attrName = ATTR_SSD;
            attrValue = attrValue.replace(/[^0-9 TGBtgb]/g, '').toUpperCase().trim();
        }

        if (attrName === "Kapasite") {
            attrName = ATTR_HDD;
            attrValue = attrValue.replace(/[^0-9 TGBtgb]/g, '').toUpperCase().trim();
        }

        if (attrName === "İşlemci Tipi") {
            attrName = ATTR_CPU;
            attrValue = attrValue.toLocaleUpperCase();
        }

        if (attrName === "İşlemci Modeli") {
            attrName = ATTR_CPU_MODEL;
            attrValue = attrValue.toLocaleUpperCase();
        }

        if (attrName === "Ekran Boyutu") {
            attrName = ATTR_SCREEN_SIZE;
            attrValue = attrValue.replace(/[^0-9.,]/g, '').replace(/,/g, '.');
        }

        return {
            attrName: attrName,
            attrValue: attrValue
        }
    }
}

const hepsiburadaGeneralizer = {
    "Laptop": (attrName, attrValue) => {
        if (attrName === "Bellek Hızı") {
            attrName = ATTR_RAM_SPEED;
            attrValue = attrValue.replace(/[^0-9]/g, '') + " MHZ";
        }

        if (attrName === "Ekran Kartı Hafızası") {
            attrName = ATTR_GPU_MEMORY;
            attrValue = attrValue.replace(/[^0-9]/g, '') + " GB";
        }

        if (attrName === "Ram (Sistem Belleği)") {
            attrName = ATTR_RAM;
            attrValue = attrValue.replace(/[^0-9]/g, '') + " GB";
        }

        if (attrName === "SSD Kapasitesi") {
            attrName = ATTR_SSD;
            attrValue = attrValue.replace(/[^0-9 TGBtgb]/g, '').toUpperCase().trim();
        }

        if (attrName === "Harddisk Kapasitesi") {
            attrName = ATTR_HDD;
            attrValue = attrValue.replace(/[^0-9 TGBtgb]/g, '').toUpperCase().trim();
        }

        if (attrName === "İşlemci") {
            attrName = ATTR_CPU_MODEL;
            attrValue = attrValue.toLocaleUpperCase();
        }

        if (attrName === "İşlemci Tipi") {
            attrName = ATTR_CPU;
            attrValue = attrValue.toLocaleUpperCase();
        }

        if (attrName === "Ekran Boyutu") {
            attrName = ATTR_SCREEN_SIZE;
            attrValue = attrValue.replace(/[^0-9.,]/g, '').replace(/,/g, '.');
        }

        return {
            attrName: attrName,
            attrValue: attrValue
        }
    },
    "Masaüstü Bilgisayar": (attrName, attrValue) => {
        if (attrName === "Bellek Hızı") {
            attrName = ATTR_RAM_SPEED;
            attrValue = attrValue.replace(/[^0-9]/g, '') + " MHZ";
        }

        if (attrName === "Bellek Yuvası") {
            attrName = ATTR_RAM_SLOT;
            attrValue = attrValue.replace(/[^0-9]/g, '');
        }

        if (attrName === "HDD Hızı") {
            attrName = ATTR_HDD_SPEED;
            attrValue = attrValue.replace(/[^0-9]/g, '');
        }

        if (attrName === "Power Supply") {
            attrName = ATTR_PSU;
            attrValue = attrValue.replace(/[^0-9]/g, '');
        }

        if (attrName === "Ram Tipi") {
            attrName = ATTR_RAM_TYPE;
            attrValue = attrValue.trim();
        }

        if (attrName === "Ram Kapasitesi") {
            attrName = ATTR_RAM_MAX;
            attrValue = attrValue.replace(/[^0-9]/g, '') + " GB";
        }

        if (attrName === "İşlemci Hızı") {
            attrName = ATTR_CPU_SPEED;
            attrValue = attrValue.replace(/[^0-9,.]/g, '').replace(/\./g, ',');
        }

        if (attrName === "Ekran Kartı Modeli") {
            attrName = ATTR_GPU_MODEL;
            attrValue = attrValue.trim();
        }

        if (attrName === "Ekran Kartı Hafızası") {
            attrName = ATTR_GPU_MEMORY;
            attrValue = attrValue.replace(/[^0-9]/g, '') + " GB";
        }

        if (attrName === "Ram (Sistem Belleği)") {
            attrName = ATTR_RAM;
            attrValue = attrValue.replace(/[^0-9]/g, '') + " GB";
        }

        if (attrName === "SSD Kapasitesi") {
            attrName = ATTR_SSD;
            attrValue = attrValue.replace(/[^0-9 TGBtgb]/g, '').toUpperCase().trim();
        }

        if (attrName === "Harddisk Kapasitesi") {
            attrName = ATTR_HDD;
            attrValue = attrValue.replace(/[^0-9 TGBtgb]/g, '').toUpperCase().trim();
        }

        if (attrName === "İşlemci") {
            attrName = ATTR_CPU_MODEL;
            attrValue = attrValue.toLocaleUpperCase();
        }

        if (attrName === "İşlemci Tipi") {
            attrName = ATTR_CPU;
            attrValue = attrValue.toLocaleUpperCase();
        }

        return {
            attrName: attrName,
            attrValue: attrValue
        }
    }
}