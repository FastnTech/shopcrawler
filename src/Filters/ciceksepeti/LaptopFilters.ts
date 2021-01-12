import Filter from "../../abstract/Filter";

class LaptopFilters extends Filter {
    getFilters(): object[] {
        return [
            {
                name: "RAM",
                filter: this.ramFilter
            },
            {
                name: "Ekran Boyutu",
                filter: this.ekranFilter
            },
            {
                name: "SSD",
                filter: this.ssdFilter
            },
            {
                name: "HDD",
                filter: this.hddFilter
            },
            {
                name: "İşlemci",
                filter: this.cpuFilter
            }
        ];
    };

    ramFilter(aValue: string, bValue: string): boolean {
        return aValue === bValue;
    }

    ekranFilter(aValue: string, bValue: string): boolean {
        return aValue.indexOf(bValue) !== -1;
    }

    ssdFilter(aValue: string, bValue: string): boolean {
        return aValue === bValue;
    }

    hddFilter(aValue: string, bValue: string): boolean {
        return aValue === bValue;
    }

    cpuFilter(aValue: string, bValue: string): boolean {
        return bValue.indexOf(aValue) !== -1;
    }
}

export default LaptopFilters