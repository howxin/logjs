"use strict";

const LEVEL_RATE = {
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    FATAL: 5,
};

class LogBase {

    constructor(opts) {
        this.outputLevel = LEVEL_RATE[(opts.outputLevel || 'DEBUG').toUpperCase()];
    }

    isOutput(level) {
        return (LEVEL_RATE[level] >= this.outputLevel);
    }

    log(level, logStr, filePath) {

    }

}

module.exports = LogBase;