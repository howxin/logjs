declare type Opts = {
    hocks: Hock[];
};
export declare function logger(prefix?: string): Logger;
export declare function configure(opts: Opts): void;
export declare function newConsoleHock(outputLevel?: string, timezone?: string): Hock;
export declare function newFileHock(logFilePath: string, outputLevel?: string, timezone?: string): Hock;
export declare function on(levels: string, onListen: any): void;
declare class Hock {
    private type;
    private outputLevel;
    private timezone;
    private logFilePath;
    constructor(type: string, outputLevel?: string, timezone?: string, logFilePath?: string);
    out(): {
        type: string;
        timezone: string;
        outputLevel: string;
        logFilePath: string;
    };
}
declare interface Logger {
    debug(...args: any[]): void;
    debugf(format: string, ...args: any[]): void;
    info(...args: any[]): void;
    infof(format, ...args: any[]): void;
    warn(...args): void;
    warnf(format: string, ...args: any[]): void;
    error(...args): void;
    errorf(format: string, ...args: any[]): void;
    fatal(...args): void;
    fatalf(format: string, ...args: any[]): void;
    objLog(level, obj): void;
}
