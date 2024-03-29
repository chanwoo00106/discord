import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import { CommandInteraction, EmbedBuilder } from "discord.js";
import config from "src/config";
import { Week } from "src/types";
import { dateCalc } from "src/lib/dateCalc";
import { ScheduleType } from "src/types/ScheduleType";

export const data = new SlashCommandBuilder()
  .setName("schedule")
  .setDescription("시간표 출력")
  .addStringOption((option) =>
    option
      .setName("week")
      .setDescription("요일")
      .setChoices(
        { name: "월", value: "Mon" },
        { name: "화", value: "Tue" },
        { name: "수", value: "Wed" },
        { name: "목", value: "Thu" },
        { name: "금", value: "Fri" }
      )
      .setRequired(true)
  );

const Weeks = { Mon: "월", Tue: "화", Wed: "수", Thu: "목", Fri: "금" };

export async function execute(interaction: CommandInteraction) {
  const atDate = interaction.options.data[0].value as Week;

  const [date, month, day] = dateCalc(atDate);

  const { data } = await axios.get<ScheduleType>(
    `${config.SCHEDULE_API}${date.getFullYear()}${month}${day}`
  );

  if (!data.hisTimetable.length) throw new Error();

  const result = data.hisTimetable[1].row?.map((i) => i.ITRT_CNTNT);

  return new EmbedBuilder()
    .setTitle(
      `${date.getFullYear()}년 ${month}윌 ${day}일 ${Weeks[atDate]}요일 시간표`
    )
    .setFields(
      ...result?.map((i, index) => ({ name: `${index + 1}교시`, value: i }))
    )
    .setColor("#1dd1a1")
    .setFooter({
      text: interaction.member?.user.username || "인식하지 못했어요.",
      iconURL: `https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}.png`,
    })
    .setTimestamp();
}
