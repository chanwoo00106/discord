import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { Discord, Slash } from "discordx";
import { MealType } from "../types/mealType";
import axios from "axios";
const meal = ["아침", "점심", "저녁"];
@Discord()
class MealDiscord {
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

      if (!data.mealServiceDietInfo) {
        const embeds = new MessageEmbed().setTitle("급식이 없는 날입니다");
        interaction.reply({ embeds: [embeds] });
      }

      const re: RegExp = /<br\/>/gi;
      const embeds = new MessageEmbed()
        .setTitle(`${date.getFullYear()}년 ${month}윌 ${day}일 급식`)
        .addFields(
          data.mealServiceDietInfo[1].row.map((dishName, i) => ({
            name: meal[i],
            value: dishName.DDISH_NM.replace(re, "\n"),
            inline: true,
          }))
        )
        .setFooter({
          text: interaction.member?.user.username || "인식하지 못했어요.",
          iconURL: `https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}.png`,
        })
        .setTimestamp()
        .setColor("#fd9644");
      console.log(interaction.member?.user.username);

      interaction.reply({ embeds: [embeds] });
    } catch (e) {
      console.log(e);
      const embeds = new MessageEmbed().setTitle("오류가 생겼습니다.");
      interaction.reply({ embeds: [embeds] });
    }
  }
}
