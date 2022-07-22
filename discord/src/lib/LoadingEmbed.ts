import { CommandInteraction, EmbedBuilder } from "discord.js";
import { discordUserImg } from "./discordUserImg";

export const LoadingEmbed = (interaction: CommandInteraction) =>
  new EmbedBuilder()
    .setTitle("Loading...")
    .setDescription("The moment please")
    .setFooter({
      text: interaction.member?.user.username || "인식하지 못했어요.",
      iconURL: discordUserImg(interaction),
    })
    .setColor("#0fbcf9")
    .setTimestamp();
