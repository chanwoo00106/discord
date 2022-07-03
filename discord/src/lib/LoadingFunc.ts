import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import { errorEmbed } from "./errorEmbed";
import { LoadingEmbed } from "./LoadingEmbed";

export async function LoadingFunc(
  execute: (
    interaction: CommandInteraction,
    client: Client
  ) => Promise<MessageEmbed>,
  interaction: CommandInteraction,
  client: Client
) {
  try {
    await interaction.reply({ embeds: [LoadingEmbed(interaction)] });
    const embeds = await execute(interaction, client);

    return interaction.editReply({ embeds: [embeds] });
  } catch (e) {
    return interaction.editReply({ embeds: [errorEmbed(interaction)] });
  }
}
