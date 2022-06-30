import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import config from "src/config";
import * as Commands from "src/commands";
import { SlashCommandBuilder } from "@discordjs/builders";

interface CommandType {
  data: SlashCommandBuilder;
}

const commands = [];

for (const command of Object.values<CommandType>(Commands))
  commands.push(command.data);

const rest = new REST({ version: "9" }).setToken(config.BOT_TOKEN);

rest
  .put(Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID), {
    body: commands,
  })
  .then(() => {
    console.log("Successfully registered application commands.");
  })
  .catch(console.error);
