import Filter from "../../abstract/Filter";

class LaptopFilters extends Filter {
    getFilters(): object[] {
        return [
            {
                name: ATTR_RAM,
                filter: this.ramFilter
            },
            {
                name: ATTR_SCREEN_SIZE,
                filter: this.ekranFilter
            },
            {
                name: ATTR_SSD,
                filter: this.ssdFilter
            },
            {
                name: ATTR_HDD,
                filter: this.hddFilter
            },
            {
                name: ATTR_CPU,
                filter: this.cpuFilter
            },
            {
                name: ATTR_CPU_MODEL,
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
        return aValue === bValue;
    }
}

export default LaptopFilters