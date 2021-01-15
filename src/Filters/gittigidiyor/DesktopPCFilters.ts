import Filter from "../../abstract/Filter";
import {
    ATTR_RAM,
    ATTR_SSD,
    ATTR_HDD,
    ATTR_CPU,
    ATTR_GPU_MEMORY,
    ATTR_GPU_MODEL,
    ATTR_RAM_TYPE
} from '../../core/Attributes';

class DesktopPCFilters extends Filter {
    getFilters(): object[] {
        return [
            {
                name: ATTR_RAM,
                filter: this.equal
            },
            {
                name: ATTR_SSD,
                filter: this.equal
            },
            {
                name: ATTR_HDD,
                filter: this.equal
            },
            {
                name: ATTR_CPU,
                filter: this.equal
            },
            {
                name: ATTR_GPU_MEMORY,
                filter: this.equal
            },
            {
                name: ATTR_GPU_MODEL,
                filter: this.equal
            },
            {
                name: ATTR_RAM_TYPE,
                filter: this.equal
            },
        ];
    };

    equal(aValue: string, bValue: string): boolean {
        return aValue === bValue;
    }
}

export default DesktopPCFilters