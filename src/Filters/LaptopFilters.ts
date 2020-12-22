import Filter from "../abstract/Filter";
class LaptopFilters extends Filter {
    ramFilter = (e: { [x: string]: string; }) => {
        return e["attributeName"] === "RAM"
    };
    
    screenSizeFilter = (e: { [x: string]: string; }) => {
        return e["attributeName"] === "Ekran Boyutu"
    };
    
    ssdFilter = (e: { [x: string]: string; }) => {
        return e["attributeName"] === "SSD"
    };
    
    hddFilter = (e: { [x: string]: string; }) => {
        return e["attributeName"] === "HDD"
    };
    
    cpuFilter = (e: { [x: string]: string; }) => {
        return e["attributeName"] === "İşlemci"
    };
    
    cpuModelFilter = (e: { [x: string]: string; }) => {
        return e["attributeName"] === "İşlemci Model"
    };
}

export default LaptopFilters