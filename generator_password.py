# вариант 7

import random

id = 0#input() # идентификатор
N = 10#len(id) # количество символом идентификатора
password = ""
M = 11  # количество символом пароля

Q = N % 8  # для расположения малых букв русского алфавита
rus = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя"
symbols = {'!', '”', '#', '$', '%', '&', '’', '(', ')', '*'}

i = 1  # счетчик символом пароля
while i < 12:
    if i <= 2:
        password += str(round(random.randint(0,9)))
    elif 3 <= i <= 2+Q:
        password += random.choice(rus)
    elif 4 <= i <= 11:
        password += str(random.sample(list(symbols), 1)[0])
    i += 1
print(password)
