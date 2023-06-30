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
const getUrl = faker.internet.url();
const getMimeType = faker.helpers.arrayElement([
  'image/jpg',
  'image/png',
  'image/jpge',
]);

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

function buildProductInCart({ ...overrides } = {}) {
  return {
    id: getId,
    quantity: getId,
    subtotal: getPrice(),
    product: buildProduct({
      id: getId,
      category: undefined,
      images: undefined,
    }),
    ...overrides,
  };
}

function buildCart({ ...overrides } = {}) {
  return {
    id: getId,
    total: getPrice(),
    products: [buildProductInCart(), buildProductInCart()],
    ...overrides,
  };
}

function buildOrder({ ...overrides } = {}) {
  return {
    id: getId,
    total: getPrice,
    productId: undefined,
    orderDetails: [buildProductInCart(), buildProductInCart()],
    ...overrides,
  };
}

function buildImage({ ...overrides } = {}) {
  return {
    id: getId,
    name: getTitleProducts,
    mimetype: getMimeType,
    productId: getId,
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
  buildCart,
  buildProductInCart,
  buildOrder,
  buildImage,
  getBoolean,
  getDescription,
  getEmail,
  getId,
  getPassword,
  getToken,
  getUsername,
  getTitleProducts,
  getPrice,
  getUrl,
};
