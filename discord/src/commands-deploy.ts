import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import config from "src/config";
import * as Commands from "src/commands";

export function commandDeploy(guildId: string) {
  try {
    const commands = [];

    for (const command of Object.values(Commands)) commands.push(command.data);

    const rest = new REST({ version: "9" }).setToken(config.BOT_TOKEN);

    rest
      .put(Routes.applicationGuildCommands(config.CLIENT_ID, guildId), {
        body: commands,
      })
      .then(() => {
        console.log("Successfully registered application commands.");
      })
      .catch(console.error);
  } catch (e) {
    console.log("commands register failed");
    console.log(e);
  }
}
