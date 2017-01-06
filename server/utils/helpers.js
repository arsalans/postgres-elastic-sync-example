/**
 * Created by arsal on 2016-12-10.
 */
'use strict';
function isUndefinedOrNull(value) {
    return value === null || typeof value === 'undefined';
}
exports.isUndefinedOrNull = isUndefinedOrNull;
function validateIsUndefinedOrNull(value, message) {
    if (value === null || typeof value === 'undefined') {
        throw new Error(message + " is either null or undefined.");
    }
}
exports.validateIsUndefinedOrNull = validateIsUndefinedOrNull;
//# sourceMappingURL=helpers.js.map