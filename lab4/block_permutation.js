const alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ_'

const cipher_text = 'СВРЕИДЦИАКФИС_КЭЯИ_РАТОП'
const key = 'ПОБЕДА' // П=15, О=14, Б=1, Е=4, Д=3, А=0

// Дешифрование текста
function decryptText(key='', Code='') {
    if (!key) {
        log('Укажите ключ!')
        return
    }
    if (!Code) {
        log('Укажите шивр!')
        return
    }
    const array = key.split('').sort()
    const Key = key.split('').map(el => {
        const index = array.indexOf(el)
        array[index] = ''
        return index
    })
    let result = ''
    for (let i = 0; Code.split('').slice(i, i + Key.length).length != 0; i+= Key.length) {
        const array = Code.split('').slice(i, i+ Key.length)
        result += Key.map(el => {
            return array[el]
        }).join('')
    }
    return result
}

const plainText = decryptText(key, cipher_text);
console.log(`Расшифрованный текст: ${plainText}`);