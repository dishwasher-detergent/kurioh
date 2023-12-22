import { readFileSync } from "fs";
import { createServer } from "http-proxy";
import * as path from "path";

const cert = path.join(process.cwd(), "certificates/kennybass.xyz.pem");
const key = path.join(process.cwd(), "certificates/kennybass.xyz-key.pem");

createServer({
  xfwd: true,
  ws: true,
  target: {
    host: "kennybass.xyz",
    port: 3001,
  },
  ssl: {
    key: readFileSync(key, "utf8"),
    cert: readFileSync(cert, "utf8"),
  },
})
  .on("error", function (e) {
    console.error(`Request failed to proxy: ${e.message}`);
  })
  .listen(3000);
