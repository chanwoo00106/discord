import config from "src/config";
import { Client } from "discord.js";

export const client = new Client({
  intents: ["GUILDS", "GUILD_MEMBERS", "DIRECT_MESSAGES"],
});

client.once("ready", () => {
  console.log("🤖 Discord bot ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;
  if (commandName === "ping") return interaction.reply("pong");
});

client.login(config.BOT_TOKEN);
