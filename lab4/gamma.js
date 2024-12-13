function decodingGammaSuperpositionModuloN(key='', Code='') {
    const Alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ0123456789'
    if (!key) {
        log('Укажите ключ!')
        return
    }
    if (!Code) {
        log('Укажите шивр!')
        return
    }

    let Key = key.split('')

    return Code.split('').map(el => {
        const indexKey = Alphabet.indexOf(Key.shift())
        if (Key.length == 0) Key = key.split('')

        const index = Alphabet.indexOf(el)
        return Alphabet[(index - indexKey + Alphabet.length-1) % (Alphabet.length-1)]
    }).join('')
}

key = 'ВАНИНО'
text = 'УЁТЙЩ5Л_ДВНЁБ3ЕАН'

console.log(decodingGammaSuperpositionModuloN(key, text))