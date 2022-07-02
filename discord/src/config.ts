import * as dotenv from "dotenv";
import { ENV } from "src/lib/env";

dotenv.config({
  path: __dirname + `/../.env.${process.env.NODE_ENV}`,
});

const {
  BOT_TOKEN,
  MEAL_API,
  GITHUB_API,
  SCHEDULE_API,
  GUILD_ID,
  CLIENT_ID,
  NODE_ENV,
} = process.env;

if (
  !BOT_TOKEN ||
  !MEAL_API ||
  !GITHUB_API ||
  !SCHEDULE_API ||
  !GUILD_ID ||
  !CLIENT_ID ||
  !NODE_ENV
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
};

export default config;
