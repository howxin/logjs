"use strict";
const { EventEmitter } = require('events');
const Logger = require('./lib/logger.js');
const util = require('./lib/util.js');

const ch = new EventEmitter();
const logLevel = {
    debug: 'DEBUG',
    info: 'INFO',
    warn: 'WARN',
    error: 'ERROR',
};
const loggerMap = new Map();

exports.logLevel = logLevel;

exports.logger = (prefix = 'default') => {
    return loggerMap.get(prefix);
};

exports.configure = (opts = {}) => {
    const hockClients = [];
    opts.hocks.forEach(hock => {
        if (!hock instanceof Hock) {
            throw new Error('');
        }
        hockClients.push(hock.out());
    });
    let loggerOpts = {
        prefix: 'default',
        filePath: util.getFilePath(),
        clients: hockClients,
        ch: ch,
    };
    const defaultLogger =  new Logger(loggerOpts);
    loggerMap.set('default', defaultLogger);
};

exports.newConsoleHock = (outputLevel, timezone) => {
    return new Hock('console', outputLevel, timezone);
};

exports.newFileHock = (logFilePath, outputLevel, timezone) => {
    return new Hock('file', outputLevel, timezone, logFilePath);
};

exports.on = (levels, onListen) => {
    if (!Array.isArray(levels)) {
        levels = [levels];
    }
    let logLevels = Object.values(logLevel);
    for (const l of levels) {
        if (!logLevels.includes(l)) {
            throw new Error('invalid log level');
        }
    }
    if (typeof onListen !== 'function') {
        throw new Error('onLister must be a function');
    }
    for (const l of levels) {
        ch.on(l, (logStr) => {
            onListen(l, logStr);
        });
    }
};

class Hock {

    constructor(type, outputLevel = 'DEBUG', timezone = 'Asia/Hong_Kong', logFilePath) {
        this.type = type;
        this.outputLevel = outputLevel;
        this.timezone = timezone;
        this.logFilePath = logFilePath;
    }

    out() {
       return {
           type: this.type,
           timezone: this.timezone,
           outputLevel: this.outputLevel,
           logFilePath: this.logFilePath,
       };
    }
}

