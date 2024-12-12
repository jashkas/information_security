function decryptCaesarCipher(encryptedMessage, shift, reverse=false) {
    const alphabet = [
        'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 
        'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 
        'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 
        'Э', 'Ю', 'Я'
    ];
    const alphabetLength = alphabet.length;
    let decryptedMessage = '';

    for (let i = 0; i < encryptedMessage.length; i++) {
        const currentChar = encryptedMessage[i];
        const currentIndex = alphabet.indexOf(currentChar);

        if (currentIndex !== -1) {
            if (reverse) {
                shift = -shift
            }
            let newIndex = (currentIndex + shift + alphabetLength) % alphabetLength;
            decryptedMessage += alphabet[newIndex];
        } else {
            // символ не принадлежит алфавиту (но в данном случае это неактуально)
            decryptedMessage += currentChar;
        }
    }

    return decryptedMessage;
}

const encryptedMessage = 'ШОГЖСРЫЗФХЯНЁ';
const shift = 3;
alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'
const decryptedMessage = decryptCaesarCipher(encryptedMessage, shift);

console.log(decryptedMessage);