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

## Stay in touch

If you want to use my s3 bucket reach me out on slack (@fabioflores) and I will give you the credentials
