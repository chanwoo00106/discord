import config from "src/config";
import { Client } from "discord.js";
import * as Commands from "src/commands";
import { commandDeploy } from "./commands-deploy";
import { LoadingFunc } from "./lib/LoadingFunc";

const commands = Object(Commands);

export const client = new Client({
  intents: ["GUILDS", "GUILD_MEMBERS", "DIRECT_MESSAGES"],
});

client.once("ready", () => {
  console.log("🤖 Discord bot ready!");
  commandDeploy(config.GUILD_ID);
});

client.on("guildCreate", async (guild) => {
  const guildId = guild.commands.permissions.guildId;
  if (guildId) commandDeploy(guildId);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (!commands[commandName] || !commands[commandName].execute) return;

  await LoadingFunc(commands[commandName].execute, interaction, client);
});

client.login(config.BOT_TOKEN);
