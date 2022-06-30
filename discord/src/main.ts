import { config } from "dotenv";
import process from "process";
import { ENV } from "src/config/env";
config({
  path:
    __dirname +
    `\\${process.env.NODE_ENV === "production" ? "..\\" : ""}..\\.env.${
      process.env.NODE_ENV
    }`,
});

console.log(process.env.NODE_ENV);

console.log(process.env[ENV.BOT_TOKEN]);
