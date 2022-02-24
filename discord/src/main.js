import { Client } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

client.on("ready", () => {
  console.log(`${client.user.tag}에 로그인하였습니다!`);
  client.guilds.cache.get();
});

client.on("interactionCreate", async (interaction) => {});

client.on("message", (msg) => {
  if (msg.content === "핑") {
    msg.reply("퐁!");
  }
});

client.login(process.env.BOT_TOKEN);
