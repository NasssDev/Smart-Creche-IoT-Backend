import isJSON from 'validator/lib/isJSON';
import * as _ from 'lodash';
import moment from 'moment';

/**
 * @description Check if constiable is undefined or not
 * @param {*} str
 */
export const isEmpty = (value: any) => {
   if (
      value === undefined ||
      value === null ||
      (typeof value === 'object' && Object.keys(value).length === 0) ||
      (typeof value === 'string' && value.trim().length === 0)
   ) {
      return true;
   } else {
      return false;
   }
};

/**
 * @description Check if String and doesn't contain space and special chracters
 * @param {String} str
 */
export const isValidString = (str: string) => {
   const regExp = /^[a-zA-Z]+$/;
   if (typeof str !== 'string') {
      return false;
   } else if (!str.match(regExp)) {
      return false;
   } else {
      return true;
   }
};

/**
 * @description Custom RegEx
 * @param {String} str
 * @param {String} regEx
 */
export const customRegex = (str: string, regEx: RegExp) => {
   if (typeof str !== 'string') {
      return false;
   } else if (!regEx.test(str)) {
      return false;
   } else {
      return true;
   }
};

/**
 * @desc Checks for valid email
 * @param {String} value // Accepts string
 */
export const isEmail = (value: string) => {
   const email = value;
   const myRegEx =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   const isValid = myRegEx.test(email);
   if (isValid) {
      return true;
   } else {
      return false;
   }
};

/**
 * @desc Checks for valid array
 * @param {*} value
 */
export const isArray = (value: any) => {
   if (typeof value === 'string') {
      const replaced = value.replace(/'/g, '"');
      if (!isJSON(replaced)) {
         return false;
      } else {
         const parsed = JSON.parse(replaced);
         if (parsed.constructor === Array) {
            return true;
         } else {
            return false;
         }
      }
   } else {
      if (value.constructor === Array) {
         return true;
      } else {
         return false;
      }
   }
};

/**
 * @description Is Valid Date
 * @param {*} d
 */
export const isValidDate = (d: any) => {
   return !isNaN(Date.parse(d));
};

/**
 * @description Check if valid string
 * @param {String} value
 */
export const isString = (value: string | object) => {
   return typeof value === 'string' || value instanceof String;
};

/**
 * @desc Checks if given value is Decimal Number
 * @param {*} value // Accepts string
 */
export const isDecimalNumber = (value: any) => {
   const number = value;
   const myRegEx = /^\d+(\.\d+)?$/;
   const isValid = myRegEx.test(number);
   if (isValid) {
      return true;
   } else {
      return false;
   }
};

/**
 * @desc Checks if given value is Number
 * @param {*} value // Accepts string
 */
export const isNumber = (value: any) => {
   const number = value;
   const myRegEx = /^(\s*[0-9]+\s*)+$/;
   const isValid = myRegEx.test(number);
   if (isValid) {
      return true;
   } else {
      return false;
   }
};

/**
 * @desc Checks if given value is Boolean
 * @param {*} value // Accepts string
 */
export const isBoolean = (value: any) => {
   if (typeof value === 'boolean') {
      return true;
   } else {
      return false;
   }
};

/**
 * @desc Checks if given value is Aplha Numeric
 * @param {*} value // Accepts string
 */
export const isAlphaNumeric = (value: any) => {
   const string = value;
   const myRegEx = /^[a-z0-9 ]+$/i;
   const isValid = myRegEx.test(string);
   if (isValid) {
      return true;
   } else {
      return false;
   }
};

/**
 *
 * @param value
 */
export const validatePassword = (value: any) => {
   const string = value;
   const myRegEx = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
   const isValid = myRegEx.test(string);
   if (isValid) {
      return true;
   } else {
      return false;
   }
};

/**
 *
 * @param file
 */
export const checkFileLength = (file: any) => {
   if (!file) {
      return false;
   } else {
      if (file.data.length != 0) {
         const fileSizeKb = file.size / 1024; // in MB
         const fileSizeMb = file.size / 1024 / 1024; // in MB
         if (fileSizeKb < 10) {
            return false;
         }
         if (fileSizeMb > 10) {
            return false;
         }
         return true;
      } else {
         return false;
      }
   }
};

/**
 *
 * @param value
 */
export const isAlphaNumericWithSpecialChar = (value: any) => {
   const string = value;
   const myRegEx = /^[ A-Za-z0-9!@#%&*()-_+=\,.\/?:;'"]*$/;
   const isValid = myRegEx.test(string);
   if (isValid) {
      return true;
   } else {
      return false;
   }
};

/**
 *
 * @param value
 */
export const validatePhone = (value: any) => {
   const string = value;
   const myRegEx = /^[0-9+ ]*$/;
   const isValid = myRegEx.test(string);
   if (isValid && value.length > 4 && value.length <= 13) {
      return true;
   } else {
      return false;
   }
};

/**
 *
 * @param value
 */
export const validatePhoneNumber = (value: any) => {
   const string = value;
   const myRegEx = /^[0-9]*$/;
   const isValid = myRegEx.test(string);
   if (isValid && string.length > 4 && string.length <= 10) {
      return true;
   } else {
      return false;
   }
};

/**
 *
 * @param value
 */
export const validateDialCode = (value: any) => {
   const string = value;
   const myRegEx = /^[0-9+-]*$/;
   const isValid = myRegEx.test(string);
   if (isValid && value.length <= 8) {
      return true;
   } else {
      return false;
   }
};

/**
 *
 * @param value
 */
export const validateName = (value: any) => {
   // const string = value;
   // const myRegEx = /^[A-Za-z0-9-.,&\'_ ]*$/;
   // const isValid = myRegEx.test(string);
   // if (isValid) {
   //   return true;
   // } else {
   //   return false;
   // }
   return _.isString(value);
};

/**
 *
 * @param value
 */
export const validateDetail = (value: any) => {
   return _.isString(value);
};

export const validateLocation = (value: any) => {
   if (!value || !value.length || value.length !== 2) return false;
   return value.filter((val) => typeof val == 'number').length == 2;
};

export const validateNameLength = (value: any, maxLength = 50) => {
   try {
      if (value.length >= 1 && value.length <= maxLength) return true;
      else return false;
   } catch (err) {
      return false;
   }
};

export const validateDetilLength = (value: any) => {
   try {
      if (value.length >= 1 && value.length <= 200) return true;
      else return false;
   } catch (err) {
      return false;
   }
};

export const validateURL = (value: any) => {
   const string = value;
   const myRegEx =
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g;
   const isValid = myRegEx.test(string);
   if (isValid) {
      return true;
   } else {
      return false;
   }
};

export const validatePositiveNumber = (value: any) => {
   try {
      const number = Number(value);
      if (isNaN(number) || number < 0) return false;
      else return true;
   } catch (err) {
      return false;
   }
};
