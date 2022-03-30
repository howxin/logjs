# logjs

### 使用方法

```js
const logjs = require('logjs');

logjs.configure({
    hocks: [
        logger.newConsoleHock(),
        logger.newFileHock('./logs/test.log.'),
    ],
});
const log = logjs.logger();
log.info('hello world!!');