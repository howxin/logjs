"use strict";
const util = require('./util.js');
const LogBase = require('./logBase.js');


class Console extends LogBase {

    constructor(opts) {
        super(opts);

        this.prefix = opts.prefix;
        this.filePath = opts.filePath;
        this.timezone = opts.timezone || 'Asia/Hong_Kong';
    }

    log(level, logStr, filePath) {
        level = level.toUpperCase();
        if (super.isOutput(level)) {
            switch (level) {
                case 'DEBUG':
                    console.debug(`\x1b[2m%s %s\x1b[0m`, this._prefixFormat('DEBUG', filePath), logStr);
                    break;
                case 'INFO':
                    console.info(`\x1b[32m%s %s\x1b[0m`, this._prefixFormat('INFO', filePath), logStr);
                    break;
                case 'WARN':
                    console.warn(`\x1b[33m%s %s\x1b[0m`, this._prefixFormat('WARN', filePath), logStr);
                    break;
                case 'ERROR':
                    console.error(`\x1b[31m%s %s\x1b[0m`, this._prefixFormat('ERROR', filePath), logStr);
                    break;
                case 'FATAL':
                    console.error(`\x1b[35m%s %s\x1b[0m`, this._prefixFormat('FATAL', filePath), logStr);
                    break;

            }
        }
    }

    objOutput(level, obj) {
        if (!this.isOutput(level.toUpperCase())) {
            return;
        }
        this.log(level, JSON.stringify(obj));
    }

    _prefixFormat(level, filePath = '') {
        let time = util.dateTimezoneFormat(new Date(), this.timezone);
        return `[${time}] [pid_${process.pid}] [${level}] [${filePath}] -`;
    }

}

module.exports = Console;