import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { Discord, Slash } from "discordx";
import { MealType } from "../types/mealType";
import axios from "axios";

@Discord()
class choicesExample {
  @Slash("meal")
  async meal(interaction: CommandInteraction) {
    const date = new Date();
    const month =
      Math.floor(date.getMonth() + 1) / 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    const day =
      Math.floor(date.getDate()) / 10 ? "0" + date.getDate() : date.getDate();
    const queryUrl =
      process.env.MEAL_API + `${date.getFullYear()}${month}${day}`;
    try {
      const { data }: { data: MealType } = await axios.get(queryUrl);
      const re: RegExp = /<br\/>/gi;
      const embeds = new MessageEmbed()
        .setTitle(
          `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 급식`
        )
        .addFields(
          {
            name: "아침",
            value: data.mealServiceDietInfo[1].row[0].DDISH_NM.replace(
              re,
              "\n"
            ),
          },
          {
            name: "점심",
            value: data.mealServiceDietInfo[1].row[1].DDISH_NM.replace(
              re,
              "\n"
            ),
          },
          {
            name: "저녁",
            value: data.mealServiceDietInfo[1].row[2].DDISH_NM.replace(
              re,
              "\n"
            ),
          }
        )
        .setColor("#fd9644");

      interaction.reply({ embeds: [embeds] });
    } catch (e) {
      const embeds = new MessageEmbed().setTitle("오류가 생겼습니다.");
      interaction.reply({ embeds: [embeds] });
    }
  }
}
