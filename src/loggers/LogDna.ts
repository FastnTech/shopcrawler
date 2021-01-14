const logdna = require('@logdna/logger');

const options = {
    app: 'Shopicer',
    level: 'debug'
};

let logger = null;

if (!global["logDna"]) {
    global["logDna"] = logdna.createLogger('07ff65e6c044cfb70a394e4d42a99e98', options);
}

logger = global["logDna"];

export default logger;