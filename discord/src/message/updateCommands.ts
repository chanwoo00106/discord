import { Message } from "discord.js";
import config from "src/config";
import { findAllGuilds } from "src/firebase/index";
import { commandDeploy } from "src/commands-deploy";
import { messageLoadingEmbed } from "src/lib/messageLoadingEmbed";

export async function execute(message: Message) {
  message.channel.send({ embeds: [messageLoadingEmbed(message)] });

  try {
    if (
      message.guild?.id !== config.GUILD_ID &&
      message.member?.id === config.MASTER_ID
    )
      return;

    const data = await findAllGuilds();

    if (!data) return;

    Object.keys(data).map((i) => {
      commandDeploy(i, data[i], message);
    });
  } catch (e) {
    console.log(e);
  }
}
