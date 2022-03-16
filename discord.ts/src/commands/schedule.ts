import { CommandInteraction, MessageEmbed } from "discord.js";
import { Discord, Slash, SlashChoice, SlashOption } from "discordx";
import { scheduleType } from "../types/scheduleType";
import axios from "axios";

type Week = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "토" | "일";

type DateCalc = [Date, string, string];

@Discord()
class MealDiscord {
  @Slash("schedule")
  async schedule(
    @SlashChoice("Mon")
    @SlashChoice("Tue")
    @SlashChoice("Wed")
    @SlashChoice("Thu")
    @SlashChoice("Fri")
    @SlashOption("week", { description: "요일 선택" })
    atDate: Week,
    interaction: CommandInteraction
  ) {
    try {
      const [date, month, day] = dateCalc(atDate);
      const queryUrl =
        process.env.SCHEDULE_API + `${date.getFullYear()}${month}${day}`;
      const { data }: { data: scheduleType } = await axios.get(queryUrl);

      if (!data.hisTimetable) {
        await interaction.reply({
          embeds: [new MessageEmbed().setTitle("수업이 없는 날입니다.")],
          fetchReply: true,
        });
        return;
      }

      const result = data.hisTimetable[1].row?.map((i) => i.ITRT_CNTNT);

      const embeds = new MessageEmbed()
        .setTitle(`${date.getFullYear()}년 ${month}윌 ${day}일 시간표`)
        .setFields(
          ...result?.map((i, index) => ({ name: `${index + 1}교시`, value: i }))
        )
        .setColor("#1dd1a1")
        .setFooter({
          text: interaction.member?.user.username || "인식하지 못했어요.",
          iconURL: `https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}.png`,
        })
        .setTimestamp();

      interaction.reply({ embeds: [embeds], fetchReply: true });
    } catch (e) {
      console.log(e);
      const embeds = new MessageEmbed().setTitle("오류가 생겼습니다.");
      await interaction.reply({ embeds: [embeds], fetchReply: true });
    }
  }
}

function dateCalc(atDate: Week): DateCalc {
  const date = getDate(atDate);

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

const week = ["일", "Mon", "Tue", "Wed", "Thu", "Fri", "토"];

function getDate(weekday: Week): Date {
  const date = new Date();
  const index = week.findIndex((i) => i === weekday);
  const day = date.getDay();
  return new Date(new Date().setDate(new Date().getDate() + (index - day)));
}
