abstract class Filter {
    abstract getFilters(): object[];

    attributeFilter (attributes: any, equal: string) {
        let filtered = attributes.filter((e: { [x: string]: string; }) => e["attributeName"] === equal);

        return filtered.length > 0 ? filtered[0]["attributeValue"].length > 0 ? filtered[0]["attributeValue"] : "NONE" : "NONE";
    };

    apply (attributesA: any, attributesB: any): boolean {
        let filters = this.getFilters();
        let applyResult: boolean = false;
        let noneCounter: number = 0;

        for (let i = 0; i < filters.length; i++) {
            const filterName = filters[i]["name"];
            const filterFunction = filters[i]["filter"];

            let aValue: string = this.attributeFilter(attributesA, filterName);
            let bValue: string = this.attributeFilter(attributesB, filterName);

            if (aValue === "NONE" && bValue === "NONE") {
                noneCounter++;
            }

            let result: boolean = filterFunction(aValue, bValue);

            console.log(`${filterName} attribute check is ${result} | =>(${aValue} - ${bValue})<=`);

            if (!result) {
                applyResult = false;
                break;
            } else {
                applyResult = true;
            }
        }

        return noneCounter === filters.length ? false : applyResult;
    };
}

export default Filter;