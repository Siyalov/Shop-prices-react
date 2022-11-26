# **Shop-Prices** API documentation (v1)

## Quick start table

| Method and Path | Auth | Action |
|-|-|-|
| POST `/auth/register` | | register a new user |
| POST `/auth/login` | | authenticate user into system |
| GET `/auth/whoami` | yes | user information |
||
| GET `/products` | | get list of products |
| POST `/products` | yes | create new product |
| GET `/products/:id` | | get specific product (+history) |
| PUT `/products/:id` | yes | update existed product (diff) |
| DELETE `/products/:id` | yes | delete existed product (mark as hidden) |
||
| GET `/images/static/:ean` | | get image by ean barcode |
||
| GET `/shops` | | get list of shops |
| GET `/shops/:id` | | get shop info (+all products) |
| GET `/shops/:id/products` | | get shop products |
| POST `/shops` | yes | add new shop |
| PUT `/shops/:id` | yes | update shop info (diff) |
| DELETE `/shops/:id` | yes | delete existed shop |

## API principles

### Data exchange

* Data transmission follows REST HTTP(s) principles
* The term `HTTP root path` (or `API root`) with value `/api/v1` means, that `/auth/register` really located at `/api/v1/auth/register`
* Data serialized in JSON format
* If the client send JSON - the client must specify `Content-Type` HTTP header with value `application/json`
* Default strings encoding is `Unicode` (usually same as `utf-8`)
* API supports compression/decompression using `gzip` and `deflate` (you can specify `Accept-Encoding` as `gzip, deflate` to receive compressed data from server, or send your compressed data to server with `Content-Encoding` header)

### Authentication

* Users can register and authenticate via `/auth/` routes
* Some API endpoints requires authentication:
    * `/auth/login` returns `token`
    * this `token` must be used in every request that requires authentication
    * that `token` must be placed in HTTP `Authorization` header, prepended with `Bearer ` (the space is required after `Bearer`, so `Authorization` header value would be like `Bearer eyJhbGc....`)

## Detailed Routes description

### Errors

#### Generic HTTP Errors (Not found, Internal Server Error, etc.)

Response status code: `any`

Response body format:
```typescript
{
    "status": "fail",
    "message": string // for 404 will be "Not Found"
}
```

#### Validation errors

Response status code: `422` (`Unprocessable Entity`)

Example response body (for types see `Zod` library):
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

### Registration, Authorization and current user information Endpoints

#### Registration

HTTP Method: `POST`

Path: `/auth/registration`

Request body format:
```typescript
{
    "username": string, // 1..64 symbols
    "password": string, // 1..64 symbols
    "hidden": boolean, // optional
}
```
Response body format:
```typescript
{
    "ok": true
}
```

#### Authorization

HTTP Method: `POST`

Path: `/auth/login`

Request body format:
```typescript
{
    "username": string, // 1..64 symbols
    "password": string, // 1..64 symbols
}
```
Response body format:
```typescript
{
    "token": string, // usually starts with eyJhbGc...
}
```

#### Current user information

HTTP Method: `GET`

Path: `/auth/whoami`

Response body format:
```typescript
{
    "username": string,
}
```

### Products

#### Get many (with filters)

HTTP Method: `GET`

Path: `/products`

Query string parameters (all parameters is optional):
* `page` - current page, number, must be greater than or equal to 0, by default is `0`
* `pageSize` - page size (entries count), number, must be greater than 0, by default is `50`
* `sortBy` - sort by field, one of: `id | hidden | name | createdAt | updatedAt`, by default is `createdAt`
* `order` - sort order, one of: `DESC | ASC | asc | desc`, by default is `DESC`
* `q` - query for search, string, minimum length is 1, will search in product.name, barcode
* `barcodes` - show barcodes in response (also enables search by barcode partial match)
* `prices` - show prices in response
* `shops` - show shops in response

Response status code: `200` (`OK`)

Response body format:
```typescript
{
    "page": number,
    "pageSize": number,
    "entries": Array<{
        "id": string, // GUID
        "hidden": boolean,
        "name": string,
        "createdAt": string, // like 2012-12-31T23:59:59.123Z
        "updatedAt": string, // like 2012-12-31T23:59:59.123Z
        "prices": Array<{
            // only latest price showed here for each shop
            "id": string, // GUID
            "price": number,
            "shopId": string, // GUID,
            "updatedAt": string, // like 2012-12-31T23:59:59.123Z
        }>,
        "barcodes": Array<{
            "id": string, // GUID
            "barcode": string,
            "updatedAt": string, // like 2012-12-31T23:59:59.123Z
        }>,
        "shops": Array<{
            "id": string, // GUID
            "name": string,
        }>
    }>
}
```

#### Get one (by id)

HTTP Method: `GET`

Path: `/products/:id`

Parameters:
* `:id` - Product Identifier (id)

Response status code: `200` (`OK`)

Response body format:
```typescript
{
    "id": string, // GUID
    "hidden": boolean,
    "name": string,
    "createdAt": string, // like 2012-12-31T23:59:59.123Z
    "updatedAt": string, // like 2012-12-31T23:59:59.123Z
    "prices": Array<{
        // all prices showed here for all shops
        "id": string, // GUID
        "price": number,
        "shopId": string, // GUID,
        "updatedAt": string, // like 2012-12-31T23:59:59.123Z
    }>,
    "barcodes": Array<{
        "id": string, // GUID
        "barcode": string,
        "updatedAt": string, // like 2012-12-31T23:59:59.123Z
    }>,
    "shops": Array<{
        "id": string, // GUID,
        "name": string,
    }>
}
```

#### Add new one

HTTP Method: `POST`

Path: `/products`

Requires:
* Authorization

Request body format:
```typescript
{
    "hidden": boolean, // optional
    "name": string,
}
```

Response status code: `201` (`Created`)

Response body format:
```typescript
{
    "id": string, // GUID
    "hidden": boolean,
    "name": string,
    "createdAt": string, // like 2012-12-31T23:59:59.123Z
    "updatedAt": string, // like 2012-12-31T23:59:59.123Z
}
```

#### Change one (by id)

HTTP Method: `PUT`

Path: `/products/:id`

Parameters:
* `:id` - Product Identifier (id)

Requires:
* Authorization

Request body format:
```typescript
{
    // you can send only changed fields
    "hidden": boolean, // optional
    "name": string, // optional
}
```

Response status code: `202` (`Accepted`)

Response body format:
```typescript
{
    "id": string, // GUID
    "hidden": boolean,
    "name": string,
    "createdAt": string, // like 2012-12-31T23:59:59.123Z
    "updatedAt": string, // like 2012-12-31T23:59:59.123Z
}
```

#### Delete one (by id)

HTTP Method: `DELETE`

Path: `/products/:id`

Parameters:
* `:id` - Product Identifier (id)

Requires:
* Authorization

Response status code: `204` (`No Content`)

### Images

#### Get image (by product EAN barcode)

HTTP Method: `GET`

Path: `/images/static/:ean`

Parameters:
* `:ean` - EAN barcode

Response status code: `200` (`OK`)

Response body: `raw image in jpg/png`

### Shops

#### Get list of shops

HTTP Method: `GET`

Path: `/products`

Query string parameters (all parameters is optional):
* `page` - current page, number, must be greater than 0, by default is `0`
* `pageSize` - page size (entries count), number, must be greater than 0, by default is `50`
* `sortBy` - sort by field, one of: `id | hidden | name | createdAt | updatedAt`, by default is `createdAt`
* `order` - sort order, one of: `DESC | ASC | asc | desc`, by default is `DESC`
* `q` - query for search, string, minimum length is 1, will search in shop.name

Response status code: `200` (`OK`)

Response body format:
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
        "createdAt": string, // like 2012-12-31T23:59:59.123Z
        "updatedAt": string, // like 2012-12-31T23:59:59.123Z
    }>
}
```

#### Get specific shop information

HTTP Method: `GET`

Path: `/shops/:id`

Parameters:
* `:id` - Product Identifier (id)

Response status code: `200` (`OK`)

Response body format:
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
    "createdAt": string, // like 2012-12-31T23:59:59.123Z
    "updatedAt": string, // like 2012-12-31T23:59:59.123Z
    "products": Array<{
        "id": string, // GUID
        "name": string,
        "prices": Array<{
            // all product prices in current shop
            "id": string, // GUID,
            "price": number,
            "updatedAt": string // like 2012-12-31T23:59:59.123Z
        }>
    }>
}
```



#### Add new one

HTTP Method: `POST`

Path: `/shops`

Requires:
* Authorization

Request body format:
```typescript
{
    "hidden": boolean, // optional
    "name": string,
    "country": string, // optional
    "city": string, // optional
    "address": string, // optional
    "lat": number, // optional
    "lon": number, // optional
}
```

Response status code: `201` (`Created`)

Response body format:
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
    "createdAt": string, // like 2012-12-31T23:59:59.123Z
    "updatedAt": string, // like 2012-12-31T23:59:59.123Z
}
```

#### Change one (by id)

HTTP Method: `PUT`

Path: `/shops/:id`

Parameters:
* `:id` - Shop Identifier (id)

Requires:
* Authorization

Request body format:
```typescript
{
    // you can send only changed fields, all of them are optional
    "hidden": boolean,
    "name": string,
    "country": string,
    "city": string,
    "address": string,
    "lat": number,
    "lon": number
}
```

Response status code: `202` (`Accepted`)

Response body format:
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
    "createdAt": string, // like 2012-12-31T23:59:59.123Z
    "updatedAt": string, // like 2012-12-31T23:59:59.123Z
}
```

#### Delete one (by id)

HTTP Method: `DELETE`

Path: `/shops/:id`

Parameters:
* `:id` - Shop Identifier (id)

Requires:
* Authorization

Response status code: `204` (`No Content`)
