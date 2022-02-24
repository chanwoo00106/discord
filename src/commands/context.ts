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
    user: User | GuildMember | undefined,
    interaction: ContextMenuInteraction
  ) {
    if (interaction.member?.user.username === "baekteun")
      interaction.reply("저거 씹덕 아니여");
    else interaction.reply(`${user} hello!`);
  }
}
