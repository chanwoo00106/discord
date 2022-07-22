import { CommandInteraction } from "discord.js";

export const discordUserImg = (interaction: CommandInteraction) =>
  `https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}.png`;
