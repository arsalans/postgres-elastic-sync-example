/**
 * Created by arsal on 2016-12-10.
 */
'use strict';
export function isUndefinedOrNull(value) {
  return value === null || typeof value === 'undefined';
}

export function validateIsUndefinedOrNull(value, message) {
  if (value === null || typeof value === 'undefined')
  {
    throw new Error(message + " is either null or undefined.");
  }
}
