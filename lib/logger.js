"use strict";
const util = require('util');
const utils = require('./util.js');
const Console = require('./console.js');
const File = require('./file.js');

class Logger {

    constructor(opts) {
        this.options = opts;
        this.outputs = null;
        this.ch = opts.ch;
    }

    debug(...args) {
        this.debugf(this._makeFormatStr(args), ...args);
    }

    debugf(format, ...args) {
        this._output('debug', util.format(format, ...args));
    }

    info(...args) {
        this.infof(this._makeFormatStr(args), ...args);
    }

    infof(format, ...args) {
        this._output('info', util.format(format, ...args));
    }

    warn(...args) {
        this.warnf(this._makeFormatStr(args), ...args);
    }

    warnf(format, ...args) {
        this._output('warn', util.format(format, ...args));
    }

    error(...args) {
        this.errorf(this._makeFormatStr(args), ...args);
    }

    errorf(format, ...args) {
        this._output('error', util.format(format, ...args));
    }

    fatal(...args) {
        this.fatalf(this._makeFormatStr(args), ...args);
    }

    fatalf(format, ...args) {
        this._output('fatal', util.format(format, ...args));
    }

    objLog(level, obj) {
        if (typeof obj !== 'object') { //仅针对对象可用
            return;
        }
        this._load();
        this.outputs.forEach(o => {
            if (o.objOutput) {
                o.objOutput(level, obj, utils.getExecFilePath());
            }
        });
    }

    _load() {
        if (this.outputs === null) {
            this.outputs = this.options.clients.map(clientOpts => {
                switch (clientOpts.type) {
                    case 'console':
                        return new Console({
                            prefix: this.options.prefix,
                            filePath: this.options.filePath,
                            timezone: clientOpts.timezone,
                            outputLevel: clientOpts.outputLevel,
                        });
                    case 'file': {
                        return new File({
                            prefix: this.options.prefix,
                            filePath: this.options.filePath,
                            timezone: clientOpts.timezone,
                            logFilePath: clientOpts.logFilePath,
                            outputLevel: clientOpts.outputLevel,
                            eol: clientOpts.eol,
                        });
                    }
                    default:
                        throw new Error('invalid logger type');
                }
            });
        }
    }

    _makeFormatStr(args) {
        let output = args.map(v => {
            let map = { string: '%s', object: '%O', number: '%d' };
            return map[typeof v];
        });
        return output.join(' ');
    }

    _output(level, logStr) {
        this._load();
        this.outputs.forEach(o => {
            o.log(level, logStr, utils.getExecFilePath());
        });
        this.ch.emit(level.toUpperCase(), logStr);
    }

}

module.exports = Logger;