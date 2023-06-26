export const configuration = () => ({
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRATION_TIME,
  },
});
