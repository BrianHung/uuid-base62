// https://en.wikipedia.org/wiki/Base62
export var base62charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
// "RCF 4122 section 3 requires that UUID generators output in lowercase and systems accept UUIDs in upper and lowercase."
export var base16charset = "0123456789abcdef";
/**
 * Adds two arrays for the given base, returning the result.
 * Source: https://github.com/donmccurdy/hex2dec
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
 * Source: https://github.com/donmccurdy/hex2dec
 */
function multiplyByNumber(num, x, base) {
    if (num == 0)
        return [];
    var result = [];
    var power = x;
    while (true) {
        if (num & 1)
            result = add(result, power, base);
        num = num >> 1;
        if (num === 0)
            break;
        power = add(power, power, base);
    }
    return result;
}
/**
 * Parses string encoded in charset into digits array, e.g. '9' -> [62].
 * Source: https://github.com/donmccurdy/hex2dec
 */
var cachedMappings = {};
function parseToDigitsArray(str, charset) {
    var charsetMapping = cachedMappings[charset];
    if (charsetMapping === undefined) {
        charsetMapping = {};
        for (var i = 0; i < charset.length; i++)
            charsetMapping[charset[i]] = i;
        cachedMappings[charset] = charsetMapping;
    }
    var chars = str.split('');
    var array = [];
    for (var i = chars.length - 1; i >= 0; i--) {
        var n = charsetMapping[chars[i]];
        if (n === undefined)
            throw new RangeError("String " + str + " contains " + chars[i] + " which is not part of the charset " + charset + ".");
        array.push(n);
    }
    return array;
}
/**
 * Converts a string encoded in fromBase to toBase.
 * Source: https://github.com/donmccurdy/hex2dec
 * @param str string encoded in fromBase
 * @param fromBase integer base 1-62 to convert from
 * @param toBase integer base 1-62 to convert to
 * @return out string encoded in toBase
 */
export function convertBase(str, fromBase, toBase) {
    var digits = parseToDigitsArray(str, fromBase);
    var outArray = [];
    var power = [1];
    for (var i = 0; i < digits.length; i++) {
        if (digits[i])
            outArray = add(outArray, multiplyByNumber(digits[i], power, toBase.length), toBase.length);
        power = multiplyByNumber(fromBase.length, power, toBase.length);
    }
    var out = '';
    for (var i = outArray.length - 1; i >= 0; i--) {
        out += toBase[outArray[i]];
    }
    return out;
}
/**
 * Encodes uuid into base62.
 * @param uuidString
 * @return length-22 base62-encoded string
 */
export function uuidEncodeBase62(uuidString, base16, base62) {
    if (base16 === void 0) { base16 = base16charset; }
    if (base62 === void 0) { base62 = base62charset; }
    var base16String = uuidString.replace(/-/g, '');
    var base62String = convertBase(base16String, base16, base62);
    var paddingChar = base62[0];
    base62String = base62String.padStart(22, paddingChar); // ensure string is length 22
    return base62String;
}
/**
 * Decodes base62 into uuid.
 * @param {string} base62 encoded string
 * @return {string} uuid
 */
export function uuidDecodeBase62(baseString, base16, base62) {
    if (base16 === void 0) { base16 = base16charset; }
    if (base62 === void 0) { base62 = base62charset; }
    var base16String = convertBase(baseString, base62, base16);
    var paddingChar = base16[0];
    base16String = base16String.padStart(32, paddingChar); // ensure string is length 32
    var uuid = [base16String.slice(0, 8), base16String.slice(8, 12), base16String.slice(12, 16), base16String.slice(16, 20), base16String.slice(20)];
    return uuid.join('-');
}
