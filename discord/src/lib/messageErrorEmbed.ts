import { Message, EmbedBuilder } from "discord.js";

export const messageErrorEmbed = (message: Message, guildId: string) =>
  new EmbedBuilder()
    .setTitle(`${guildId} 실패`)
    .setDescription("command 등록에 실패했습니다")
    .setFooter({
      text: message.member?.user.username || "인식하지 못했어요.",
      iconURL: `https://cdn.discordapp.com/avatars/${message.member?.user.id}/${message.member?.user.avatar}.png`,
    })
    .setColor("#e84118")
    .setTimestamp();
