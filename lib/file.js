"use strict";
const fs = require('fs');
const path = require('path');
const util = require('./util.js');
const LogBase = require('./logBase.js');


class File extends LogBase {

    constructor(opts = {}) {
        super(opts);

        if (opts.logFilePath === null || opts.logFilePath === undefined) {
            throw new Error('logjs[type=file] logFilePath can not empty.');
        }

        this.prefix = opts.prefix;
        this.filePath = opts.filePath;
        this.logFilePath = opts.logFilePath;
        this.timezone = opts.timezone || 'Asia/Hong_Kong';
        this.eol = opts.eol || '\n';
        this._stream = null;
        this._streamTime = null;
        this.reload();
    }

    log(level, logStr, filePath) {
        level = level.toUpperCase();

        if (super.isOutput(level)) {
            let jsonData = {
                "pid": process.pid,
                "level": level,
                "time": util.currentDatetime(),
                "file": filePath,
                "msg": logStr,
            };

            if (!this.writable) {
                const err = new Error(` log stream had been closed`);
                console.error(err.stack);
                return;
            }
            let buf = JSON.stringify(jsonData) + this.eol;
            this._write(buf);
        }
    }

    objOutput(level, obj, filePath = '') {
        level = level.toUpperCase();

        if (!this.isOutput(level)) {
            return;
        }
        let rawMsg = JSON.stringify(obj);
        obj.pid = process.pid;
        obj.level = level;
        obj.time = util.currentDatetime();
        obj.file = filePath;
        if (!obj.msg) { //默认使用msg自动存储原始对象
            obj.msg = rawMsg;
        } else { //如果msg已被对象包含，使用rawMsg字段
            obj.rawMsg = rawMsg;
        }
        let buf = JSON.stringify(obj) + this.eol;
        this._write(buf);
    }

    reload() {
        this._closeStream();
        this._stream = this._createStream();
    }

    close() {
        this._closeStream();
    }

    end() {
        this.close();
    }

    get writable() {
        return this._stream && !this._stream.closed && this._stream.writable && !this._stream.destroyed;
    }

    _write(buf) {
        if (util.getDateString() !== this._streamTime) {
            this.reload();
        }
        this._stream.write(buf);
    }

    _createStream() {
        // mkdirp.sync(path.dirname(this.options.file));
        this._streamTime = util.getDateString();

        const logFilePath = path.resolve(this.logFilePath + this._streamTime);
        const stream = fs.createWriteStream(logFilePath, { flags: 'a' });

        const onError = err => {
            const now = new Date();
            console.error('%s ERROR %s [logjs] [%s] %s',
                util.dateToDatetime(now), process.pid, err.stack);
            this.reload();
            console.warn('%s WARN %s [logjs] [%s] reloaded', util.dateToDatetime(now), process.pid);
        };
        // only listen error once because stream will reload after error
        stream.once('error', onError);
        stream._onError = onError;
        return stream;
    }

    _closeStream() {
        if (this._stream) {
            this._stream.end();
            this._stream.removeListener('error', this._stream._onError);
            this._stream = null;
        }
    }


}

module.exports = File;