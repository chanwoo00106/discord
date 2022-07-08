import * as dotenv from "dotenv";
import { ENV } from "src/lib/env";

dotenv.config({
  path: `${process.env.INIT_CWD?.replace(/\\/g, "/")}/.env.${
    process.env.NODE_ENV
  }`,
});

console.log(
  `${process.env.INIT_CWD?.replace(/\\/g, "/")}/.env.${process.env.NODE_ENV}`
);

const {
  BOT_TOKEN,
  MEAL_API,
  GITHUB_API,
  SCHEDULE_API,
  GUILD_ID,
  CLIENT_ID,
  NODE_ENV,
  APP_ID,
  API_KEY,
  PROJECT_ID,
  AUTH_DOMAIN,
  MEASUREMENT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
} = process.env;

if (
  !BOT_TOKEN ||
  !MEAL_API ||
  !GITHUB_API ||
  !SCHEDULE_API ||
  !GUILD_ID ||
  !CLIENT_ID ||
  !NODE_ENV ||
  !APP_ID ||
  !API_KEY ||
  !PROJECT_ID ||
  !AUTH_DOMAIN ||
  !MEASUREMENT_ID ||
  !STORAGE_BUCKET ||
  !MESSAGING_SENDER_ID
)
  throw new Error("Missing enviroment variables");

const config: Record<ENV, string> = {
  BOT_TOKEN,
  MEAL_API,
  GITHUB_API,
  SCHEDULE_API,
  GUILD_ID,
  CLIENT_ID,
  NODE_ENV,
  APP_ID,
  API_KEY,
  PROJECT_ID,
  AUTH_DOMAIN,
  MEASUREMENT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
};

export default config;
