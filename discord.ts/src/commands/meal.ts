import { CommandInteraction, MessageEmbed } from "discord.js";
import { Discord, Slash, SlashChoice, SlashOption } from "discordx";
import { MealType } from "../types/mealType";
import axios from "axios";

const meal = ["아침", "점심", "저녁"];

type AtDate = "어제" | "오늘" | "내일";

type DateCalc = [Date, string, string];

@Discord()
class MealDiscord {
  @Slash("meal")
  async meal(
    @SlashChoice("어제")
    @SlashChoice("오늘")
    @SlashChoice("내일")
    @SlashOption("date", { description: "날짜 선택" })
    atDate: AtDate,
    interaction: CommandInteraction
  ) {
    try {
      const [date, month, day] = dateCalc(atDate);
      const queryUrl =
        process.env.MEAL_API + `${date.getFullYear()}${month}${day}`;

      const { data }: { data: MealType } = await axios.get(queryUrl);

      if (!data.mealServiceDietInfo) {
        const embeds = new MessageEmbed().setTitle("급식이 없는 날입니다");
        interaction.reply({ embeds: [embeds], fetchReply: true });
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

      await interaction.reply({ embeds: [embeds], fetchReply: true });
    } catch (e) {
      console.log(e);
      const embeds = new MessageEmbed().setTitle("오류가 생겼습니다.");
      await interaction.reply({ embeds: [embeds], fetchReply: true });
    }
  }
}

function dateCalc(atDate: AtDate): DateCalc {
  let date = new Date();
  switch (atDate) {
    case "어제":
      date = new Date(date.setDate(date.getDate() - 1));
    case "오늘":
      break;
    case "내일":
      date = new Date(date.setDate(date.getDate() + 1));
  }
  const month = `${
    Math.floor(date.getMonth() + 1) < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1
  }`;
  const day = `${
    Math.floor(date.getDate()) < 10 ? "0" + date.getDate() : date.getDate()
  }`;

  return [date, month, day];
}
