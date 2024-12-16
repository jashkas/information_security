import crypto from "crypto";


// Подпись сообщения
export function sign(message, privateKey) {
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(message);
  return signer.sign(privateKey);
}

export function verify(message, signature, publicKey) {
  const verifier = crypto.createVerify("RSA-SHA256");
  verifier.update(message);
  return verifier.verify(publicKey, signature);
}