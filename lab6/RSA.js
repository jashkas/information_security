import NodeRSA from "node-rsa";

export default function generateRSAKeys(log = false, keySize = 2048) {
  try {
    const key = new NodeRSA({ b: keySize }); // b - размер ключа в битах
    const publicKey = key.exportKey("public");
    const privateKey = key.exportKey("private");
    if (log) {
      console.log("Public Key:\n", publicKey);
      console.log("\nPrivate Key:\n", privateKey);
    }
    return { publicKey, privateKey };
  } catch (error) {
    console.error("Error generating keys:", error);
    return null;
  }
}
