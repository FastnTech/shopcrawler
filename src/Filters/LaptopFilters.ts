import Filter from "../abstract/Filter";

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
            },
            {
                name: "İşlemci Model",
                filter: this.cpuModelFilter
            },
        ];
    };

    ramFilter(aValue: string, bValue: string): boolean {
        return aValue === bValue;
    }

    ekranFilter(aValue: string, bValue: string): boolean {
        return aValue === bValue;
    }

    ssdFilter(aValue: string, bValue: string): boolean {
        return aValue === bValue;
    }

    hddFilter(aValue: string, bValue: string): boolean {
        return aValue === bValue;
    }

    cpuFilter(aValue: string, bValue: string): boolean {
        return aValue === bValue;
    }

    cpuModelFilter(aValue: string, bValue: string): boolean {
        return bValue.indexOf(aValue) !== -1;
    }
}

export default LaptopFilters