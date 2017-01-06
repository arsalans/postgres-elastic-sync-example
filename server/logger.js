/**
 * Created by arsal on 2017-01-05.
 */
var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'elastic-sync.log' })
  ]
});

module.exports = logger;
