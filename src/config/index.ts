export const configuration = () => ({
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRATION_TIME,
  },
  aws: {
    region: process.env.AWS_REGION,
    secret: process.env.AWS_SECRET_ACCESS_KEY,
    key: process.env.AWS_ACCESS_KEY_ID,
    bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465,
    email: process.env.SMTP_EMAIL,
    password: process.env.SMTP_PASSWORD,
  },
});
