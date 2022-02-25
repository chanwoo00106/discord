import { ContextMenuInteraction, GuildMember, User } from "discord.js";
import { Discord, ContextMenu, SlashOption } from "discordx";

@Discord()
export abstract class contextTest {
  @ContextMenu("MESSAGE", "message context")
  async messageHandler(interaction: ContextMenuInteraction) {
    interaction.reply("hello!");
  }

  @ContextMenu("USER", "user context")
  async userHandler(
    @SlashOption("user", { type: "USER" })
    user: any,
    interaction: ContextMenuInteraction
  ) {
    if (interaction.member?.user.username === "baekteun")
      interaction.reply("씹덕은 사용하지 못합니다");
    else if (user.user.username === "baekteun")
      interaction.reply("으악! 이런 씹덕");
    else interaction.reply(`${user} hello!`);
  }
}
