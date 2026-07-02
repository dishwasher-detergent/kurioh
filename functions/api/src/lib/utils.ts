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
 * Thrown by database_service.get when the requested row does not exist.
 * Lets route handlers distinguish "not found" from unexpected failures
 * and return a 404 with a meaningful message instead of a generic 500.
 */
export class NotFoundError extends Error {}
