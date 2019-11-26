const moment = require('moment-timezone');

const config = require('../config');
const log = require('../utils/logger');

// Return object with fields that exist in both oldObj and newObj and are
// which values are different between newObj and oldObj
function getChangedFields(fields, newObj, oldObj) {
  let result = {};
  for (const field of fields) {
    if (
      field in newObj &&
      newObj[field] !== undefined &&
      field in oldObj &&
      oldObj[field] !== undefined &&
      newObj[field] !== oldObj[field]
    ) {
      if (newObj[field] instanceof moment && oldObj[field] instanceof moment) {
        log.debug('Date comparison');
        if (newObj[field].isSame(oldObj[field]) === false) {
          result[field] = newObj[field];
        }
      } else {
        result[field] = newObj[field];
      }
    }
  }
  return result;
}

function formatDate(date) {
  if (isString(date) || date instanceof Date) {
    return moment(date, config.get('DATE_FORMAT'));
  }
  return date;
}

// Returns true if a value is a string
function isString(value) {
  return typeof value === 'string' || value instanceof String;
}

// Returns true if o is array
function isArray(o) {
  return Object.prototype.toString.call(o) === '[object Array]';
}

// Returns true if string contains a valid number
function isNumber(str) {
  if (typeof str !== 'string') return false; // we only process strings!
  // parseFloat part is required because otherwise
  // empty string would be counted as a number
  return !isNaN(str) && !isNaN(parseFloat(str));
}

// Find out if a variable contained (i.e. can be converted to) a numeric value, regardless of its type
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// Return true if value is integer/can be converted to integer
function isInt(value) {
  if (isNaN(value)) {
    return false;
  }
  var x = parseFloat(value);
  return (x | 0) === x;
}

function replaceAll(target, search, replacement) {
  if (isString(target) && isString(search) && isString(replacement)) {
    return target.split(search).join(replacement);
  } else {
    return target;
  }
}

function emptyStrToNullSanitizer(value) {
  return value === '' ? null : value;
}

module.exports = {
  getChangedFields,
  formatDate,
  isString,
  isArray,
  isNumber,
  isNumeric,
  isInt,
  replaceAll,
  emptyStrToNullSanitizer
};
