"use strict";
const logger = require('../index.js');
const out = require('./lib/output');

(async () => {
    logger.configure({
        hocks: [
            logger.newConsoleHock(),
            logger.newFileHock('C:\/Users\/howxin\/Project\/My\/logjs\/test\/test.log.'),
        ],
    });
    const log = logger.logger();
    log.info('这是test.js');
    out.log();

})();