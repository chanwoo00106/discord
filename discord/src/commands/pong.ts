import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with pong");

export async function execute(interaction: CommandInteraction) {
  return new MessageEmbed()
    .setTitle("Pong!")
    .setDescription("This is Test")
    .setColor("#FDA7DF")
    .setFooter({
      text: interaction.member?.user.username || "인식하지 못했어요.",
      iconURL: `https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}.png`,
    })
    .setTimestamp();
}
