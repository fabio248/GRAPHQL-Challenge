# API to Manage Mini Store

## Description

API to manage a mini store with entities users (client and manager role), products with upload images to amazon s3 buckets, cart and products in cart, orders and details orders

## Installation

```bash
npm install
```

create `.env file` with enviroment variable (more details `.env.example`).

## Running the app

```bash
#create database with docker
$ npm run docker:up

#To run migrations to database
$ npx prisma migrate dev

# development
$ npm run start

# watch mode
$ npm run start:dev

```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Extra points
- [X] When the stock of a product reaches 3, notify the last user that liked it and not purchased the product yet with an email. Use a background job and make sure to include the product's image in the email.
- [X] Add forgot password functionality.
- [X] Send an email when the user changes the password
- [X] Deploy


## Deployment
Deployment was making in [render](https://render.com)

You can test the API [here](https://graphql-server-65vh.onrender.com/graphql)

## Coverage Test

<img width="739" alt="image" src="https://github.com/fabio248/GRAPHQL-Challenge/assets/64715533/9d1a149e-13ef-4758-8ddc-58a25bc43d6e">

