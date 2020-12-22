abstract class Filter {
    abstract getFilters(): object[];

    attributeFilter (attributes: any, equal: string) {
        let filtered = attributes.filter((e: { [x: string]: string; }) => e["attributeName"] === equal);

        return filtered.length > 0 ? filtered[0]["attributeValue"] : "";
    };

    apply (attributesA: any, attributesB: any): boolean {
        let filters = this.getFilters();
        let applyResult: boolean = false;

        for (let i = 0; i < filters.length; i++) {
            const filterName = filters[i]["name"];
            const filterFunction = filters[i]["filter"];

            let aValue: string = this.attributeFilter(attributesA, filterName);
            let bValue: string = this.attributeFilter(attributesB, filterName);

            let result: boolean = filterFunction(aValue, bValue);

            console.log("/////log :" + result + " " + aValue + "-" + bValue);

            if (!result) {
                applyResult = false;
                break;
            } else {
                applyResult = true;
            }
        }

        return applyResult;
    };
}

export default Filter;