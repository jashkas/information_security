# -*- coding: utf-8 -*-
import argparse

def caesar(text, key, alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'): 
    decrypted_text = ''
    for char in text:
        if char.upper() in alphabet:
            idx = (alphabet.index(char.upper()) - key) % len(alphabet)
            decrypted_text += alphabet[idx]
        else:
            decrypted_text += char
    return decrypted_text

def bruteforce(text, alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'):
    decrypted_texts = []  # Список для хранения расшифрованных текстов
    # Проходим по всем сдвигам от -1 до -len(alphabet)
    for key in range(-1, -len(alphabet), -1):
        # Получаем расшифрованный текст для текущего сдвига
        decrypted_text = caesar(text, key, alphabet)
        # Добавляем расшифрованный текст в список, если он отличается от исходного
        if decrypted_text != text:
            decrypted_texts.append(decrypted_text)
    # Выводим все расшифрованные тексты в обратном порядке
    for decrypted_text in reversed(decrypted_texts):
        print(decrypted_text)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Расшифруйте текст с помощью грубой силы шифра Цезаря.")
    parser.add_argument('text', type=str, help='Текст для расшифровки с помощью грубой силы.')
    args = parser.parse_args()
    bruteforce(args.text)

import sys
sys.stdout.reconfigure(encoding='utf-8')