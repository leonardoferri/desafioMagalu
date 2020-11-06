'use strict';

const moment = require('moment');
const crypto = require('crypto');
const removeAccents = require('remove-accents');
var algorithm = 'aes256';
var key = '31460b08fe4f95004617c9d4b5de4ffee0affb43';
const ignoredKeys = require('../common/ignoredKeys')
const getProperty = require('../common/getProperty');

module.exports = class Utility {

  static nowMoment() {
    var date = new Date();
    date = date.toGMTString();
    date = new Date(date);
    date = new Date(date.getTime() + (date.getTimezoneOffset() * 60 * 1000));
    return new moment(date).subtract(process.env.UTC_TIME, 'h');
  }

  static now() {
    return Utility.nowMoment().toDate();
  }

  static nowFormat(format) {
    return Utility.nowMoment().format(format);
  }

  static nowAddDaysFormat(days, format) {
    return Utility.nowMoment().add(days, 'days').format(format);
  }

  static nowAddHoursFormat(hours, format) {
    return Utility.nowMoment().add(hours, 'hours').format(format);
  }

  static parseInt(value) {

    if (value == null || value.length == 0) return 0;
    let retValue = parseInt(value);
    if (isNaN(retValue)) return 0;
    return retValue;

  }

  static isNullOrEmpty(obj) {
    if (obj == null || obj == "") {
      return true;
    }

    return false;
  }

  static trim(string) {
    return string.replace(/^\s+|\s+$/g, "");
  }

  static dateDiff(firstDate, thenDate, unit = "s") {
    firstDate = moment(firstDate);
    thenDate = moment(thenDate);
    if (!firstDate || !thenDate || !firstDate.isValid() || !thenDate.isValid()) {
      return 0
    }
    let diff = moment.duration(firstDate.diff(thenDate))
    return diff.as(unit)
  }

  static sha1(input) {
    return crypto.createHash('sha1').update(JSON.stringify(input)).digest('hex')
  }

  static lowerCaseRemoveAccents(value) {
    if (value != null) {
      return Utility.removeSpecialCharacters(removeAccents(value).toLowerCase());
    }
    return null;
  }

  static removeSpecialCharacters(s) {
    return s.replace(/[^\w\s]/gi, '');
  }

  static removeIdFromObjInsideArray(arr) {
    let newArray = [];

    if (arr != null) {
      for (var i = 0; i < arr.length; i++) {
        let copy = JSON.parse(JSON.stringify(arr[i]));
        delete copy._id;
        newArray.push(copy);
      }
    }
    return newArray;
  }

  static encrypt(data) {
    var cipher = crypto.createCipher(algorithm, key);
    var encrypted = cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
    return encrypted;
  }

  static decrypt(data) {
    var decipher = crypto.createDecipher(algorithm, key);
    var decrypted = decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');
    return decrypted;
  }

  static stringFormatter(str) {
    let args = [].slice.call(arguments, 1),
      i = 0;

    return str.replace(/%@/g, function () {
      return args[i++];
    });
  }

  static normalizeProperties(obj) {

    if (!obj) return {};

    const keys = Object.keys(obj);

    const validKeys = keys.filter(key => !ignoredKeys.includes(key.toLowerCase()));

    return validKeys.reduce((acc, key) => (acc[key.toLowerCase()] = obj[key], acc), {});
  }

  static getProperty(path, obj) {
    return getProperty(path, obj);
  }
}
