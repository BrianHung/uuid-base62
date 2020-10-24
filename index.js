// Define a character set for bases 1 to 62.
var charset = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Adds two arrays for the given base, returning the result.
 * See https://github.com/donmccurdy/hex2dec
 * @param {number[]} x 
 * @param {number[]} y
 * @param {number} base 
 * @return {number[]} z
 */
function add(x, y, base) {
  var z = [];
  var n = Math.max(x.length, y.length);
  var carry = 0;
  var i = 0;
  while (i < n || carry) {
    var xi = i < x.length ? x[i] : 0;
    var yi = i < y.length ? y[i] : 0;
    var zi = carry + xi + yi;
    z.push(zi % base);
    carry = Math.floor(zi / base);
    i++;
  }
  return z;
}

/**
 * Returns num * x.
 * See https://github.com/donmccurdy/hex2dec
 * @param {number} num 
 * @param {number[]} x 
 * @param {number} base
 * @return {number[]} result
 */
function multiplyByNumber(num, x, base) {
  if (num < 0) return null;
  if (num == 0) return [];

  var result = [];
  var power = x;
  while (true) {
    if (num & 1) result = add(result, power, base);
    num = num >> 1;
    if (num === 0) break;
    power = add(power, power, base);
  }

  return result;
}

/**
 * Parses string encoded in charset into digits array, e.g. 'Z' -> [62].
 * See https://github.com/donmccurdy/hex2dec
 * @param {string} str 
 * @return {number[]} array
 */
function parseToDigitsArray(str) {
  var digits = str.split('');
  var array = [];
  for (var i = digits.length - 1; i >= 0; i--) {
    var n = charset.indexOf(digits[i]);
    if (n === -1) return null;
    array.push(n);
  }
  return array;
}

/**
 * Converts a string encoded in fromBase to toBase.
 * See https://github.com/donmccurdy/hex2dec
 * @param {string} str string encoded in fromBase
 * @param {integer} fromBase integer base 1-62 to convert from
 * @param {integer} toBase intger base 1-62 to convert to
 * @return {string} out string encoded in toBase
 */
function convertBase(str, fromBase, toBase) {
  var digits = parseToDigitsArray(str);
  if (digits === null) return null;

  var outArray = [];
  var power = [1];
  for (var i = 0; i < digits.length; i++) {
    if (digits[i]) outArray = add(outArray, multiplyByNumber(digits[i], power, toBase), toBase);
    power = multiplyByNumber(fromBase, power, toBase);
  }

  var out = '';
  for (var i = outArray.length - 1; i >= 0; i--) {
    out += charset[outArray[i]];
  }
  if (out === '') out = '0'
  return out;
}

/**
 * Encodes uuid into base62.
 * @param {string} uuid 
 * @return {string} length-22 base62-encoded string
 */
export function uuidEncodeBase62(uuidString) {
  var hexString = uuidString.replace(/-/g, '')
  var baseString = convertBase(hexString, 16, 62)
  baseString = baseString.padStart(22, '0') // ensure string is length 22 if uuid has leading 0s
  return baseString
}

/**
 * Decodes base62 into uuid.
 * @param {string} base62 encoded string
 * @return {string} uuid
 */
export function uuidDecodeBase62(baseString) {
  var hexString = convertBase(baseString, 62, 16).padStart(32, '0')
  hexString = hexString.padStart(32, '0') // ensure string is length 22 if baseString has leading 0s
  var uuidString = [hexString.slice(0, 8), hexString.slice(8, 12), hexString.slice(12, 16), hexString.slice(16, 20), hexString.slice(20)]
  return uuidString.join('-');
}