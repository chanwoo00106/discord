import config from "src/config";
import { Client } from "discord.js";
import * as Commands from "src/commands";

const commands = Object(Commands);

export const client = new Client({
  intents: ["GUILDS", "GUILD_MEMBERS", "DIRECT_MESSAGES"],
});

client.once("ready", () => {
  console.log("🤖 Discord bot ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;
  commands[commandName].execute(interaction, client);
});

client.login(config.BOT_TOKEN);
