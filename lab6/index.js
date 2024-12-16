import { log } from "console";
import generateRSAKeys from "./rsa.js";
import { createInterface } from "readline";
import { caesarCipherMixed } from "./caesarCipher.js";
import { sign } from "./RSA_signature.js";
import fs from "fs";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

rl.question("Введите сообщение: ", (answer) => {
  const { publicKey, privateKey } = generateRSAKeys();
  const message = caesarCipherMixed(answer);
  log(message);
  const signature = sign(message, privateKey).toString('base64');
  log(signature)
  fs.writeFileSync(
    "signature.json",
    JSON.stringify(
      {
        message,
        signature,
        publicKey,
      },
      null,
      4
    )
  );
  rl.close();
});
