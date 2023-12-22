/**
 * Creates a request object from the given context.
 * @param context - The context object containing request information.
 * @returns The request object.
 */
export const requestFromContext = (context: any) => {
  const headers = new Headers();
  for (const header of Object.keys(context.req.headers)) {
    headers.set(header, context.req.headers[header]);
  }

  let body = context.req.bodyRaw;
  if (context.req.method === 'GET' || context.req.method === 'HEAD') {
    body = undefined;
  }

  const request = new Request(context.req.url, {
    method: context.req.method,
    body,
    headers,
  });

  return request;
};

/**
 * Sends a response to the context with the specified content, status, and headers.
 * If the content type is an image or video, the content is converted to a Buffer from base64.
 * Otherwise, the content is sent as is.
 *
 * @param context - The context object.
 * @param response - The response object.
 * @returns A promise that resolves when the response is sent.
 */
export async function responseForContext(context: any, response: any) {
  const headers: Record<string, string> = {};
  for (const pair of response.headers.entries()) {
    headers[pair[0]] = pair[1];
  }

  let content;
  if (
    headers['content-type'].includes('image') ||
    headers['content-type'].includes('video')
  ) {
    content = Buffer.from(await response.text(), 'base64');
  } else {
    content = await response.text();
  }

  return context.res.send(content, response.status, headers);
}

/**
 * Throws an error if any of the keys are missing from the object
 * @param {*} obj
 * @param {string[]} keys
 * @throws {Error}
 */
export function throwIfMissing(obj: any, keys: string[]) {
  const missing = [];
  for (let key of keys) {
    if (!(key in obj) || obj[key] == null || obj[key] == undefined) {
      missing.push(key);
    }
  }
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
}
