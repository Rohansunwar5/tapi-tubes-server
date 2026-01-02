/* eslint-disable @typescript-eslint/no-non-null-assertion */
import dotenv from 'dotenv';
dotenv.config();

const config = {
  MONGO_URI: process.env.MONGO_URI! as string,
  NODE_ENV: process.env.NODE_ENV! as string,
  REDIS_HOST: process.env.REDIS_HOST! as string,
  REDIS_PORT: process.env.REDIS_PORT! as string,
  PORT: process.env.PORT! as string,
  ADMIN_JWT_SECRET: process.env.ADMIN_JWT_SECRET! as string,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY! as string,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME! as string,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY! as string,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET! as string,

  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME! as string,
  AWS_ACCESS_ID: process.env.AWS_ACCESS_ID! as string,
  AWS_SECRET: process.env.AWS_SECRET! as string,
  AWS_REGION: process.env.AWS_REGION! as string,
  SHIPROCKET_WEBHOOK_SECRET: process.env.SHIPROCKET_WEBHOOK_SECRET! as string,


  SERVER_NAME: `${process.env.SERVER_NAME}-${process.env.NODE_ENV}`! as string,
  ADMIN_JWT_CACHE_ENCRYPTION_KEY: process.env.ADMIN_JWT_CACHE_ENCRYPTION_KEY! as string,
  DEFAULT_COUNTRY_CODE: 'IN',
};

export default config;
