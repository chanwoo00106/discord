import { CommandInteraction } from "discord.js";
import { Discord, Slash, SlashChoice, SlashOption } from "discordx";
import { mongo } from "../main";

@Discord()
export abstract class AlarmDiscord {
  @Slash("alarm")
  async alarm(
    @SlashChoice("등록")
    @SlashChoice("취소")
    @SlashOption("type", { description: "등록/취소" })
    type: "등록" | "취소",
    interaction: CommandInteraction
  ) {
    try {
      if (type === "등록") {
        const save = mongo.create({
          id: interaction.id,
          userInfo: interaction.client,
        });
        (await save).save();
      } else {
        await mongo.deleteOne({ id: interaction.id });
      }
      interaction.reply("성공적으로 완료하였습니다.");
    } catch (e) {
      interaction.reply("실패했습니다. 원인은 저도 몰라여");
    }
  }
}
