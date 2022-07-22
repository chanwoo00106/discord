import { Message, EmbedBuilder } from "discord.js";

export const messageLoadingEmbed = (message: Message) =>
  new EmbedBuilder()
    .setTitle("Loading...")
    .setDescription("The moment please")
    .setFooter({
      text: message.member?.user.username || "인식하지 못했어요.",
      iconURL: `https://cdn.discordapp.com/avatars/${message.member?.user.id}/${message.member?.user.avatar}.png`,
    })
    .setColor("#0fbcf9")
    .setTimestamp();
