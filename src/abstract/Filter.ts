abstract class Filter {
    factory (a: any, b: any, f: Function): boolean {
        if (typeof a.filter(f)[0] === "undefined" || typeof b.filter(f)[0] === "undefined") {
            return false;
        }

        let aValue: string = a.filter(f)[0]["attributeValue"];
        let bValue: string = b.filter(f)[0]["attributeValue"];

        if (aValue === "" || bValue === "") {
            return false;
        }

        return  aValue === bValue; 
    };
}