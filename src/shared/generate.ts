import { faker } from '@faker-js/faker';
import { Response } from 'express';

const getUsername = faker.internet.userName();
const getEmail = faker.internet.email();
const getPassword = faker.internet.password();
const getToken = faker.string.uuid();
const getBoolean = faker.helpers.arrayElement([true, false]);
const getId = faker.number.int({ min: 1, max: 100 });
const getTitleProducts = faker.commerce.productName;
const getDescription = faker.commerce.productDescription;
const getRole = faker.helpers.arrayElement(['CLIENT', 'MANAGER']);
const getPrice = faker.commerce.price;

function buildReq({ ...overrides } = {}) {
  const req = { user: buildUserReq(), body: {}, params: {}, ...overrides };
  return req;
}

function buildRes(overrides = {}) {
  const res: Response = {
    json: jest.fn(() => res).mockName('json'),
    send: jest.fn(() => res).mockName('send'),
    ...overrides,
  } as unknown as Response;
  return res as Response;
}

function buildUser({ ...overrides } = {}) {
  return {
    id: getId,
    email: getEmail,
    password: getPassword,
    username: getUsername,
    role: getRole,
    ...overrides,
  };
}

function buildUserReq({ ...overrides } = {}) {
  return {
    sub: getId,
    role: getRole,
    ...overrides,
  };
}

function buildProduct({ ...overrides } = {}) {
  return {
    name: getTitleProducts(),
    description: getDescription(),
    stock: getId,
    price: getPrice(),
    categoryId: getId,
    isEnable: getBoolean,
    ...overrides,
  };
}

function buildCategory({ ...overrides } = {}) {
  return {
    name: getTitleProducts(),
    description: getDescription(),
    ...overrides,
  };
}

export {
  buildReq,
  buildProduct,
  buildRes,
  buildUser,
  buildUserReq,
  buildCategory,
  getBoolean,
  getDescription,
  getEmail,
  getId,
  getPassword,
  getToken,
  getUsername,
  getTitleProducts,
  getPrice,
};
