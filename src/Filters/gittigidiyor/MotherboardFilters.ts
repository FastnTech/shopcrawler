import Filter from "../../abstract/Filter";
import {
    ATTR_RAM_SLOT,
    ATTR_RAM_TYPE,
    ATTR_RAM_MAX,
    ATTR_M2_SLOT,
    ATTR_CHIPSET,
    ATTR_MOTHERBOARD_TYPE
} from '../../core/Attributes';

class MotherboardFilters extends Filter {
    getFilters(): object[] {
        return [
            {
                name: ATTR_RAM_SLOT,
                filter: this.equal
            },
            {
                name: ATTR_RAM_TYPE,
                filter: this.equal
            },
            {
                name: ATTR_RAM_MAX,
                filter: this.equal
            },
            {
                name: ATTR_M2_SLOT,
                filter: this.equal
            },
            {
                name: ATTR_CHIPSET,
                filter: this.equal
            },
            {
                name: ATTR_MOTHERBOARD_TYPE,
                filter: this.startWith
            }
        ];
    };

    equal(aValue: string, bValue: string): boolean {
        return aValue === bValue;
    }

    startWith(aValue: string, bValue: string): boolean {
        return bValue.indexOf(aValue) === 0;
    }
}

export default MotherboardFilters