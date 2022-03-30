"use strict";


module.exports = {
    log: () => {
        const log = require('../../').logger();
        log.info('这是output.js');
    },
};