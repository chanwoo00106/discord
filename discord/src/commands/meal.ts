import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import axios from "axios";
import config from "src/config";
import { MealType, AtDate } from "src/types";
import { dateCalc } from "src/lib/dateCalc";
import { discordUserImg } from "src/lib/discordUserImg";

const meal = ["아침", "점심", "저녁"];

export const data = new SlashCommandBuilder()
  .setName("meal")
  .setDescription("학교 급식 정보 요청")
  .addStringOption((option) =>
    option
      .setName("date")
      .setDescription("날짜 선택")
      .setChoices(
        { name: "오늘", value: "today" },
        { name: "내일", value: "tomorrow" },
        { name: "어제", value: "yesterday" }
      )
      .setRequired(true)
  );

export async function execute(interaction: CommandInteraction) {
  const atDate = interaction.options.getString("date") as AtDate;

  const [date, month, day] = dateCalc(atDate);

  const { data } = await axios.get<MealType>(
    `${config.MEAL_API}${date.getFullYear()}${month}${day}`
  );

  return new MessageEmbed()
    .setTitle(`${date.getFullYear()}년 ${month}윌 ${day}일 급식`)
    .addFields(
      data.mealServiceDietInfo[1].row.map((dishName, i) => ({
        name: meal[i],
        value: dishName.DDISH_NM.replace(/<br\/>/g, "\n"),
        inline: true,
      }))
    )
    .setFooter({
      text: interaction.member?.user.username || "인식하지 못했어요.",
      iconURL: discordUserImg(interaction),
    })
    .setTimestamp()
    .setColor("#fd9644");
}
