export function caesarCipherMixed(text, shift = 3) {
  let result = "";
  const lowerCyrillicStart = 1072; // 'а'
  const upperCyrillicStart = 1040; // 'А'
  const cyrillicLength = 32;
  const lowerLatinStart = 97; // 'a'
  const upperLatinStart = 65; // 'A'
  const latinLength = 26;

  for (let i = 0; i < text.length; i++) {
    let charCode = text.charCodeAt(i);
    let char = text[i];

    let isLowerCyrillic =
      charCode >= lowerCyrillicStart &&
      charCode < lowerCyrillicStart + cyrillicLength;
    let isUpperCyrillic =
      charCode >= upperCyrillicStart &&
      charCode < upperCyrillicStart + cyrillicLength;
    let isLowerLatin =
      charCode >= lowerLatinStart && charCode < lowerLatinStart + latinLength;
    let isUpperLatin =
      charCode >= upperLatinStart && charCode < upperLatinStart + latinLength;

    if (isLowerCyrillic) {
      charCode =
        ((charCode - lowerCyrillicStart + shift) % cyrillicLength) +
        lowerCyrillicStart;
    } else if (isUpperCyrillic) {
      charCode =
        ((charCode - upperCyrillicStart + shift) % cyrillicLength) +
        upperCyrillicStart;
    } else if (isLowerLatin) {
      charCode =
        ((charCode - lowerLatinStart + shift) % latinLength) + lowerLatinStart;
    } else if (isUpperLatin) {
      charCode =
        ((charCode - upperLatinStart + shift) % latinLength) + upperLatinStart;
    }

    result += String.fromCharCode(charCode);
  }
  return result;
}

export function caesarDecipherMixed(text, shift = 3) {
  let result = "";
  const lowerCyrillicStart = 1072;
  const upperCyrillicStart = 1040;
  const cyrillicLength = 32;
  const lowerLatinStart = 97;
  const upperLatinStart = 65;
  const latinLength = 26;

  for (let i = 0; i < text.length; i++) {
    let charCode = text.charCodeAt(i);
    let char = text[i];

    let isLowerCyrillic =
      charCode >= lowerCyrillicStart &&
      charCode < lowerCyrillicStart + cyrillicLength;
    let isUpperCyrillic =
      charCode >= upperCyrillicStart &&
      charCode < upperCyrillicStart + cyrillicLength;
    let isLowerLatin =
      charCode >= lowerLatinStart && charCode < lowerLatinStart + latinLength;
    let isUpperLatin =
      charCode >= upperLatinStart && charCode < upperLatinStart + latinLength;

    if (isLowerCyrillic) {
      charCode =
        ((charCode - lowerCyrillicStart - shift + cyrillicLength) %
          cyrillicLength) +
        lowerCyrillicStart;
    } else if (isUpperCyrillic) {
      charCode =
        ((charCode - upperCyrillicStart - shift + cyrillicLength) %
          cyrillicLength) +
        upperCyrillicStart;
    } else if (isLowerLatin) {
      charCode =
        ((charCode - lowerLatinStart - shift + latinLength) % latinLength) +
        lowerLatinStart;
    } else if (isUpperLatin) {
      charCode =
        ((charCode - upperLatinStart - shift + latinLength) % latinLength) +
        upperLatinStart;
    }

    result += String.fromCharCode(charCode);
  }
  return result;
}
