import { log } from "console";
import { caesarDecipherMixed } from "./caesarCipher.js";
import { verify } from "./RSA_signature.js";
import { Buffer } from "buffer";
import fs from "fs";

const data = JSON.parse(fs.readFileSync("./signature.json"));
log(data);

console.log(caesarDecipherMixed(data.message));

const isVerify = verify(data.message, Buffer.from(data.signature, 'base64'), data.publicKey);

if (isVerify) {
  console.log("Verify success");
} else {
  console.log("Verify failed");
}
