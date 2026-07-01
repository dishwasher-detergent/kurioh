/**
 * Throws an error if any of the keys are missing from the object
 * @param {*} obj
 * @param {string[]} keys
 * @throws {Error}
 */
export function throwIfMissing(obj: any, keys: string[]) {
  const missing: string[] = [];
  for (let key of keys) {
    if (!(key in obj) || obj[key] == null || obj[key] == undefined) {
      missing.push(key);
    }
  }
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
}

/**
 * Converts an array buffer to a base64 string.
 * @param arrayBuffer
 * @returns A base 64 string.
 */
export function arrayBufferToBase64(arrayBuffer: ArrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary);
}
