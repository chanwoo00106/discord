import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import config from "src/config";
import * as Commands from "src/commands";
import { Message, MessageEmbed } from "discord.js";
import { messageErrorEmbed } from "./lib/messageErrorEmbed";

export function commandDeploy(
  guildId: string,
  guildName?: string,
  message?: Message
) {
  const commands = [];

  for (const command of Object.values(Commands)) commands.push(command.data);

  const rest = new REST({ version: "9" }).setToken(config.BOT_TOKEN);

  rest
    .put(Routes.applicationGuildCommands(config.CLIENT_ID, guildId), {
      body: commands,
    })
    .then(() => {
      console.log("Successfully registered application commands.");

      if (guildName) {
        const embed = new MessageEmbed()
          .setTitle(`${guildName} 성공`)
          .setDescription("command 등록에 성공했습니다")
          .setFooter({
            text: message?.member?.user.username || "인식하지 못했어요.",
            iconURL: `https://cdn.discordapp.com/avatars/${message?.member?.user.id}/${message?.member?.user.avatar}.png`,
          })
          .setColor("#e84118")
          .setTimestamp();

        message?.channel.send({ embeds: [embed] });
      }
    })
    .catch(() => {
      if (guildName)
        message?.channel.send({
          embeds: [messageErrorEmbed(message, guildName)],
        });
    });
}
