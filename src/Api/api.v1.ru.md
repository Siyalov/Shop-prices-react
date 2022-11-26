# Документация Программного Интерфейса Приложения (API) **Shop-Prices** (v1 ru)

## Быстрый старт

| Метод и путь | Авторизация | Действие |
|-|-|-|
| POST `/auth/register` | | Регистрация нового пользователя |
| POST `/auth/login` | | Авторизация пользователя в системе |
| GET `/auth/whoami` | yes | Информация о пользователе |
||
| GET `/products` | | Получить список продуктов |
| POST `/products` | yes | Создать новый продукт |
| GET `/products/:id` | | Получить существующий продукт (+история цен) |
| PUT `/products/:id` | yes | Обновить существующий продукт (разница) |
| DELETE `/products/:id` | yes | Удалить существующий продукт (пометить как скрытый) |
||
| GET `/images/static/:ean` | | получить картинку по EAN штрихкоду |
||
| GET `/shops` | | Получить список магазинов |
| GET `/shops/:id` | | Получить существующий магазин (+все продукты) |
| POST `/shops` | yes | Добавить новый магазин |
| PUT `/shops/:id` | yes | Обновить существующий магазин (разница) |
| DELETE `/shops/:id` | yes | Удалить существующий магазин |

## Принципы API

### Обмен данными

* Обмен данные следует REST HTTP(s) принципам
* Термин `HTTP root path` (или `корень API`) со значением `/api/v1` означает, что `/auth/register` в действительности расположен `/api/v1/auth/register`
* Данные сериализованы в JSON формате
* Если клиент отправляет JSON - этот клиент должен указать `Content-Type` HTTP заголовок со значением `application/json`
* По умолчанию, строки используют кодировку `Unicode` (обычно то-же, что и `utf-8`)
* API поддерживают сжатие/распаковку используя `gzip` и `deflate` (вы можете указать `Accept-Encoding` как `gzip, deflate` чтобы получить сжатые данные с сервера, или отправить сжатые данные на сервер с заголовком `Content-Encoding`)

### Авторизация

* Пользователи могут регистрироваться и авторизоваться используя `/auth/` эндпоинты
* Некоторые API эндпоинты требуют авторизацию:
    * `/auth/login` возвращает `token` ("ключ доступа")
    * этот `token` должен использоваться в каждом запросе, что требует авторизацию
    * этот `token` должен быть размещен в HTTP заголовке `Authorization`, с предварительно добавленным `Bearer ` (требуется добавлять пробел после `Bearer`, таким образом значение заголовка `Authorization` будет примерно `Bearer eyJhbGc....`)

## Подробное описание эндпоинтов

### Ошибки

#### Обычные HTTP Ошибки (Не найдено, Внутренняя серверная ошибки, и т.д.)

Код ответа: `любой`

Формат тела ответа:
```typescript
{
    "status": "fail",
    "message": string // для 404 ошибки будет "Not Found"
}
```

#### Ошибки валидации

Код ответа: `422` (`Unprocessable Entity`, необрабатываемый объект)

Пример тела ответа (для типов смотри библиотеку `Zod`):
```typescript
{
    "status": "fail",
    "message": [
        {
            "code": "invalid_type",
            "expected": "never",
            "received": "string",
            "path": [
                "id"
            ],
            "message": "Expected never, received string"
        },
        {
            "code": "invalid_type",
            "expected": "boolean",
            "received": "number",
            "path": [
                "hidden"
            ],
            "message": "Expected boolean, received number"
        },
        {
            "code": "invalid_type",
            "expected": "string",
            "received": "undefined",
            "path": [
                "username"
            ],
            "message": "Required"
        },
        {
            "code": "too_small",
            "minimum": 1,
            "type": "string",
            "inclusive": true,
            "message": "String must contain at least 1 character(s)",
            "path": [
                "password"
            ]
        }
    ]
}
```

### Регистрация, Авторизация и Информация о текущем пользователе

#### Регистрация

HTTP метод: `POST`

Путь: `/auth/registration`

Формат тела запроса:
```typescript
{
    "username": string, // 1..64 символов
    "password": string, // 1..64 символов
    "hidden": boolean, // опционально
}
```
Формат тела ответа:
```typescript
{
    "ok": true
}
```

#### Авторизация

HTTP метод: `POST`

Путь: `/auth/login`

Формат тела запроса:
```typescript
{
    "username": string, // 1..64 символов
    "password": string, // 1..64 символов
}
```
Формат тела ответа:
```typescript
{
    "token": string, // обычно начинается с eyJhbGc...
}
```

#### Информация о текущем пользователе

HTTP метод: `GET`

Путь: `/auth/whoami`

Формат тела ответа:
```typescript
{
    "username": string,
}
```

### Продукты

#### Список товаров (с фильтрами)

HTTP метод: `GET`

Путь: `/products`

Параметры строки запроса (все параметры опциональны):
* `page` - текущая страница, число, должно быть больше или равно 0, по умолчанию `0`
* `pageSize` - размер страницы (количество записей), число, должно быть больше 0, по умолчанию `50`
* `sortBy` - сортировка по полям, одно из: `id | hidden | name | createdAt | updatedAt`, по умолчанию `createdAt`
* `order` - порядок сортировки, один из: `DESC | ASC | asc | desc`, по умолчанию `DESC`
* `q` - строка для поиска, длинны минимум 1 символ, поиск идет по product.name, barcode
* `barcodes` - отображать баркоды в ответе (также включает частичный поиск по баркодам)
* `prices` - отображать цены в ответе
* `shops` - отображать магазины в ответе

Код ответа: `200` (`OK`)

Формат тела ответа:
```typescript
{
    "page": number,
    "pageSize": number,
    "entries": Array<{
        "id": string, // GUID
        "hidden": boolean,
        "name": string,
        "createdAt": string, // например 2012-12-31T23:59:59.123Z
        "updatedAt": string, // например 2012-12-31T23:59:59.123Z
        "prices": Array<{
            // только последние цены для каждого магазина
            "id": string, // GUID
            "price": number,
            "shopId": string, // GUID,
            "updatedAt": string, // например 2012-12-31T23:59:59.123Z
        }>,
        "barcodes": Array<{
            "id": string, // GUID
            "barcode": string,
            "updatedAt": string, // например 2012-12-31T23:59:59.123Z
        }>,
        "shops": Array<{
            "id": string, // GUID
            "name": string,
        }>
    }>
}
```

#### Получение одного товара (по id)

HTTP метод: `GET`

Путь: `/products/:id`

Параметры:
* `:id` - Идентификатор товара (id)

Код ответа: `200` (`OK`)

Формат тела ответа:
```typescript
{
    "id": string, // GUID
    "hidden": boolean,
    "name": string,
    "createdAt": string, // например 2012-12-31T23:59:59.123Z
    "updatedAt": string, // например 2012-12-31T23:59:59.123Z
    "prices": Array<{
        // все цены для всех магазинов
        "id": string, // GUID
        "price": number,
        "shopId": string, // GUID,
        "updatedAt": string, // например 2012-12-31T23:59:59.123Z
    }>,
    "barcodes": Array<{
        "id": string, // GUID
        "barcode": string,
        "updatedAt": string, // например 2012-12-31T23:59:59.123Z
    }>,
    "shops": Array<{
        "id": string, // GUID,
        "name": string,
    }>
}
```

#### Добавление товара

HTTP метод: `POST`

Путь: `/products`

Требования:
* Авторизация

Формат тела запроса:
```typescript
{
    "hidden": boolean, // опционально
    "name": string,
}
```

Код ответа: `201` (`Created`, создано)

Формат тела ответа:
```typescript
{
    "id": string, // GUID
    "hidden": boolean,
    "name": string,
    "createdAt": string, // например 2012-12-31T23:59:59.123Z
    "updatedAt": string, // например 2012-12-31T23:59:59.123Z
}
```

#### Изменение существующего (по id)

HTTP метод: `PUT`

Путь: `/products/:id`

Параметры:
* `:id` - Идентификатор продукта (id)

Требования:
* Авторизация

Формат тела запроса:
```typescript
{
    // можно послать только измененные поля
    "hidden": boolean, // опционально
    "name": string, // опционально
}
```

Код ответа: `202` (`Accepted`, принято)

Формат тела ответа:
```typescript
{
    "id": string, // GUID
    "hidden": boolean,
    "name": string,
    "createdAt": string, // например 2012-12-31T23:59:59.123Z
    "updatedAt": string, // например 2012-12-31T23:59:59.123Z
}
```

#### Удаление существующего (по id)

HTTP метод: `DELETE`

Путь: `/products/:id`

Параметры:
* `:id` - Идентификатор продукта (id)

Требования:
* Авторизация

Код ответа: `204` (`No Content`, нет данных)

### Картинки

#### Получение изображения (по EAN штрихкоду продукта)

HTTP метод: `GET`

Путь: `/images/static/:ean`

Параметры:
* `:ean` - EAN штрихкод

Код ответа: `200` (`OK`)

Формат тела ответа: `картинка в формате jpg/png`

### Магазины

#### Список магазинов (с фильтрами)

HTTP метод: `GET`

Путь: `/shops`

Параметры строки запроса (все параметры опциональны):
* `page` - текущая страница, число, должно быть больше или равно 0, по умолчанию `0`
* `pageSize` - размер страницы (количество записей), число, должно быть больше 0, по умолчанию `50`
* `sortBy` - сортировка по полям, одно из: `id | hidden | name | createdAt | updatedAt`, по умолчанию `createdAt`
* `order` - порядок сортировки, один из: `DESC | ASC | asc | desc`, по умолчанию `DESC`
* `q` - строка для поиска, длинны минимум 1 символ, поиск идет по shop.name

Код ответа: `200` (`OK`)

Формат тела ответа:
```typescript
{
    "page": number,
    "pageSize": number,
    "entries": Array<{
        "id": string, // GUID
        "hidden": boolean,
        "name": string,
        "country": string | null,
        "city": string | null,
        "address": string | null,
        "lat": number | null,
        "lon": number | null,
        "createdAt": string, // например 2012-12-31T23:59:59.123Z
        "updatedAt": string, // например 2012-12-31T23:59:59.123Z
    }>
}
```

#### Получение информации о конкретном магазине

HTTP метод: `GET`

Путь: `/shops/:id`

Параметры:
* `:id` - Идентификатор магазина (id)

Код ответа: `200` (`OK`)

Формат тела ответа:
```typescript
{
    "id": string, // GUID
    "hidden": boolean,
    "name": string,
    "country": string | null,
    "city": string | null,
    "address": string | null,
    "lat": number | null,
    "lon": number | null,
    "createdAt": string, // например 2012-12-31T23:59:59.123Z
    "updatedAt": string, // например 2012-12-31T23:59:59.123Z
    "products": Array<{
        "id": string, // GUID
        "name": string,
        "prices": Array<{
            // Все цены продукта для конкретного магазина
            "id": string, // GUID,
            "price": number,
            "updatedAt": string // например 2012-12-31T23:59:59.123Z
        }>
    }>
}
```



#### Новый магазин

HTTP метод: `POST`

Путь: `/shops`

Требования:
* Авторизация

Формат тела запроса:
```typescript
{
    "hidden": boolean, // опционально
    "name": string,
    "country": string, // опционально
    "city": string, // опционально
    "address": string, // опционально
    "lat": number, // опционально
    "lon": number, // опционально
}
```

Код ответа: `201` (`Created`, создано)

Формат тела ответа:
```typescript
{
    "id": string, // GUID
    "hidden": boolean,
    "name": string,
    "country": string | null,
    "city": string | null,
    "address": string | null,
    "lat": number | null,
    "lon": number | null,
    "createdAt": string, // например 2012-12-31T23:59:59.123Z
    "updatedAt": string, // например 2012-12-31T23:59:59.123Z
}
```

#### Изменение магазина (по id)

HTTP метод: `PUT`

Путь: `/shops/:id`

Параметры:
* `:id` - Идентификатор магазина (id)

Требования:
* Авторизация

Формат тела запроса:
```typescript
{
    // вы можете отправить только изменения, все поля опциональны
    "hidden": boolean,
    "name": string,
    "country": string,
    "city": string,
    "address": string,
    "lat": number,
    "lon": number
}
```

Код ответа: `202` (`Accepted`, принято)

Формат тела ответа:
```typescript
{
    "id": string, // GUID
    "hidden": boolean,
    "name": string,
    "country": string | null,
    "city": string | null,
    "address": string | null,
    "lat": number | null,
    "lon": number | null,
    "createdAt": string, // например 2012-12-31T23:59:59.123Z
    "updatedAt": string, // например 2012-12-31T23:59:59.123Z
}
```

#### Удалить магазин (по id)

HTTP метод: `DELETE`

Путь: `/shops/:id`

Параметры:
* `:id` - Идентификатор магазина (id)

Требования:
* Авторизация

Код ответа: `204` (`No Content`, нет данных)
