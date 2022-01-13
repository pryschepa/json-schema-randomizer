# Тестовое задание JSON-schema Pryschepa

JSON-schema to Random Object

Необходимо сделать функцию, которая в качестве аргумента получает указанную JSON-schema и возвращает объект данных, который соответствует переданной JSON-schema, значения полей объектов генерируются случайным образом на основе ограничения поля описанного в JSON-schema. Для реализации нельзя использовать внешние библиотеки.

# Комментарии:

Основная задержка была вызвана праздниками и нехваткой времени(но это у всех, так что это оправдание бесполезное.)

## внешние библиотеки:

Сразу хочу сказать, что использовал две библиотеки

- express.js - просто чтобы запускать сервер и отрабатывать код(можно без нее)
- randexp.js - утилита для генерации полность рандомных regex(можно без нее)

## Поля

Не были реализованы некоторые поля для рандомной генерации данных, к примеру multiple у integer/number.
Реализация их не сложна, но займет время(

## Json-schema

С json-schema сталкивался уже, но не сильно. Для обучения и поиска полей использовал https://json-schema.org/understanding-json-schema

## Реализация и шардинг

Старался вывести переменные и любые значения в config.
В папке src находятся исходные данные и схемы для тестирования.
Так же сейчас уже понимаю, что стоило бы вынести логику генерации в отдельный файл.
Систему git использую для простоты взаимодействия.

# Install:

```bash
npm init
npm install
```

# Start:

```bash
node server.js
```

Result in console.
