import { CommandInteraction, EmbedBuilder } from "discord.js";
import { discordUserImg } from "./discordUserImg";

export const errorEmbed = (interaction: CommandInteraction) =>
  new EmbedBuilder()
    .setTitle("오류가 발생했습니다.")
    .setDescription("나중에 다시 시도해 주시기 바랍니다.")
    .setFooter({
      text: interaction.member?.user.username || "인식하지 못했어요.",
      iconURL: discordUserImg(interaction),
    })
    .setColor("#e84118")
    .setTimestamp();
