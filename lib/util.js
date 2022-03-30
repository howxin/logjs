"use strict";
const path = require('path');

class Util {

    getDateString() {
        let date = new Date();
        return date.getFullYear() +
            (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1) +
            (date.getDate() < 10 ? '0' : '') + date.getDate();
    }

    dateTimezoneFormat(date, timezone = 'UTC') {
        if (!(date instanceof Date)) {
            return date;
        }
        let options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: timezone,
        };
        try {
            let tz = new Intl.DateTimeFormat("en", options).format(date);
            return this.dateToDatetime(new Date(tz));
        } catch (err) {
            return this.dateToDatetime(date);
        }
    }

    dateToDatetime(date) {
        return date.getFullYear() + '-' +
            (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1) + '-' +
            (date.getDate() < 10 ? '0' : '') + date.getDate() + ' ' +
            (date.getHours() < 10 ? '0' : '') + date.getHours() + ':' +
            (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ':' +
            (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
    }

    currentDatetime() {
        let now = new Date();
        return now.getFullYear() + '-' +
            (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1) + '-' +
            (now.getDate() < 10 ? '0' : '') + now.getDate() + ' ' +
            (now.getHours() < 10 ? '0' : '') + now.getHours() + ':' +
            (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ':' +
            (now.getSeconds() < 10 ? '0' : '') + now.getSeconds();
    }

    getExecFilePath() {
        const _ = Error.prepareStackTrace;
        Error.prepareStackTrace = (_, stack) => stack;
        let stacks = new Error().stack;
        Error.prepareStackTrace = _;
        let pathStr = '';
        for (let callSite of stacks) {
            let _path = callSite.getFileName();
            if (_path === null
                || _path.endsWith(`logjs${path.sep}index.js`)
                || _path.endsWith(`logjs${path.sep}lib${path.sep}util.js`)
                || _path.endsWith(`logjs${path.sep}lib${path.sep}logger.js`)
                || _path.endsWith(`logjs${path.sep}lib${path.sep}file.js`)
            ) {
                continue;
            }
            pathStr = `${callSite.getFileName()}:${callSite.getLineNumber()}:${callSite.getColumnNumber()}`;
            break;
        }
        return pathStr;
    }

    getFilePath() {
        let filePath = this.getExecFilePath();
        let args = filePath.split(path.sep);
        if (args.length > 3) {
            return args.splice(-3).join(path.sep);
        } else {
            return filePath;
        }
    }

}

module.exports = new Util();