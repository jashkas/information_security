export default function generateDigest(text) {
  const words = text.split(" ");
  let digest = "";
  for (const word of words) {
    if (word.length >= 3) {
      for (let i = 2; i < word.length; i += 3) {
        digest += word[i];
      }
    }
  }
  return digest;
}