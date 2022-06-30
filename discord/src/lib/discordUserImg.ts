import { Interaction } from "discord.js";

export const discordUserImg = (interaction: Interaction) =>
  `https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}.png`;
