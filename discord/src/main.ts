import config from "src/config";
import { Client } from "discord.js";
import * as Commands from "src/commands";
import * as Messages from "src/message";
import { commandDeploy } from "./commands-deploy";
import { LoadingFunc } from "./lib/LoadingFunc";
import { addGuild, deleteGuild } from "./firebase/index";

const commands = Object(Commands);
const messages = Object(Messages);

export const client = new Client({
  intents: ["GUILDS", "GUILD_MEMBERS", "DIRECT_MESSAGES", "GUILD_MESSAGES"],
});

client.once("ready", () => {
  console.log("🤖 Discord bot ready!");
  commandDeploy(config.GUILD_ID);
});

client.on("messageCreate", async (message) => {
  if (
    !message.content.startsWith("!") ||
    !messages[message.content.replace("!", "")] ||
    !messages[message.content.replace("!", "")].execute
  )
    return;

  await messages[message.content.replace("!", "")].execute(message);
});

client.on("guildCreate", async (guild) => {
  const guildId = guild.commands.permissions.guildId;

  if (guildId) {
    addGuild(guild.name, guildId);
    commandDeploy(guildId);
  }
});

client.on("guildDelete", async (guild) => {
  const guildId = guild.commands.permissions.guildId;

  if (guildId) deleteGuild(guildId);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (!commands[commandName] || !commands[commandName].execute) return;

  await LoadingFunc(commands[commandName].execute, interaction, client);
});

client.login(config.BOT_TOKEN);
