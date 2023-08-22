# Wemo Project 面試測驗

## 題目

- 框架使用 NestJS (<https://docs.nestjs.com/>)
- 需實際連 relational DB, 何種 DB 不拘
- 設計後端 Node.js server
- 需求: 請實作租車流程
  - 基本三張表資料: User, Scooter, Rent
  - 同一 user 同時只能租一台車
  - 同一台車只能被同一個 user 租賃
  - 紀錄使用者租車的時間(起迄時間)
- 以上為必需條件, 需包含測試.
- 其他可自由發揮, 任何你覺得應該要有，但是我們沒有提到的部分
- 推上任一版控平台 (GitHub, BitBucket … etc) 並於面試前提交連結, 包含說明文件
- 我們會要求在面試時呈現你的作業, 包含環境設定、執行程式
- 有能力充分表達設計概念
- 過程中問題都可以來信討論
- 任何你覺得有趣可展示的實作或架構

## 說明

### 資料設計

![流程圖](/image/wemo_db.png)

### 資料夾結構

```
├── src
│   ├── common
│   │   ├── decorators
│   │   │   └── public.decorator.ts
│   │   ├── exceptions
│   │   │   └── custom.exception.ts
│   │   ├── filters
│   │   │   └── http-exception.filter.ts
│   │   ├── guard
│   │   │   └── auth.guard.ts
│   │   └── interceptors
│   │       └── transform.interceptor.ts
│   ├── constants
│   │   └── common.constants.ts
│   ├── controllers
│   │   ├── auth
│   │   │   ├── auth.controller.spec.ts
│   │   │   └── auth.controller.ts
│   │   ├── rent
│   │   │   ├── rent.controller.spec.ts
│   │   │   └── rent.controller.ts
│   │   ├── scooter
│   │   │   ├── scooter.controller.spec.ts
│   │   │   └── scooter.controller.ts
│   │   └── user
│   │       ├── user.controller.spec.ts
│   │       └── user.controller.ts
│   ├── entity
│   │   ├── rent.entity.ts
│   │   ├── rentStatus.entity.ts
│   │   ├── scooters.entity.ts
│   │   ├── scooterState.entity.ts
│   │   └── users.entity.ts
│   ├── main.ts # 程式進入點
│   ├── modules
│   │   ├── app.module.ts
│   │   ├── auth
│   │   │   └── auth.module.ts
│   │   ├── database
│   │   │   └── database.module.ts
│   │   ├── rent
│   │   │   └── rent.module.ts
│   │   ├── scooter
│   │   │   └── scooter.module.ts
│   │   └── user
│   │       └── user.module.ts
│   └── services
│       ├── auth
│       │   ├── auth.service.spec.ts
│       │   ├── auth.service.ts
│       │   └── dto
│       │       └── user.dto.ts
│       ├── rent
│       │   ├── dto
│       │   │   └── rent.dto.ts
│       │   ├── rent.service.spec.ts
│       │   └── rent.service.ts
│       ├── scooter
│       │   ├── dto
│       │   │   └── scooter.dto.ts
│       │   ├── scooter.service.spec.ts
│       │   └── scooter.service.ts
│       └── user
│           ├── dto
│           │   └── user.dto.ts
│           ├── user.service.spec.ts
│           └── user.service.ts
├── initial.sql
├── nest-cli.json
├── package.json
├── README.md
├── tsconfig.build.json
└── tsconfig.json
```

### 情境

程式啟動後，可以參考 swagger API 文件。（路徑：`/api`）

![情境](/image/wemo_flow.png)

#### 註冊登入

使用者可以透過 `POST/register` 註冊會員，`POST/login` 登入取得 `Authorization token`。

設置 `Authroization` 後，透過 `GET/me` 驗證 token 並取得使用者資料。

#### 取得車輛資訊

使用者可以透過 `GET/scooter` 取得所有車輛狀態，再透過 `GET/scooter/:id` 取得指定車輛詳細資訊。

#### 租借流程

使用者可以透過 `POST/rent` 租用車輛，再透過 `PUT/rent` 更改結束租用。

#### 使用者租借紀錄

使用者可以透過 `GET/user/rent` 取得該使用者所有租借紀錄。

## 啟動方式

### 設置環境變數

需新增 `.env` 檔案，並設置下列參數：

```
JWT_SECRET=
HASH_SALT=

DB_PORT=
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
```

### Installation

```bash
$ npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test
```

### Data

可以透過 `initial.sql` 建置基礎資料
