export declare var base62charset: string;
export declare var base16charset: string;
/**
 * Converts a string encoded in fromBase to toBase.
 * Source: https://github.com/donmccurdy/hex2dec
 * @param str string encoded in fromBase
 * @param fromBase integer base 1-62 to convert from
 * @param toBase integer base 1-62 to convert to
 * @return out string encoded in toBase
 */
export declare function convertBase(str: string, fromBase: string, toBase: string): string;
/**
 * Encodes uuid into base62.
 * @param uuidString
 * @return length-22 base62-encoded string
 */
export declare function uuidEncodeBase62(uuidString: string, base16?: string, base62?: string): string;
/**
 * Decodes base62 into uuid.
 * @param {string} base62 encoded string
 * @return {string} uuid
 */
export declare function uuidDecodeBase62(baseString: string, base16?: string, base62?: string): string;
//# sourceMappingURL=index.d.ts.map