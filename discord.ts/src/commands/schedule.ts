import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { Discord, Slash } from "discordx";
import { scheduleType } from "../types/scheduleType";
import axios from "axios";

@Discord()
class MealDiscord {
  @Slash("schedule")
  async schedule(interaction: CommandInteraction) {
    try {
      const date = new Date();
      const month =
        Math.floor(date.getMonth() + 1) < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      const day =
        Math.floor(date.getDate()) < 10 ? "0" + date.getDate() : date.getDate();
      const queryUrl =
        process.env.SCHEDULE_API + `${date.getFullYear()}${month}${day}`;
      const { data }: { data: scheduleType } = await axios.get(queryUrl);

      if (!data.hisTimetable) {
        interaction.reply({
          embeds: [new MessageEmbed().setTitle("수업이 없는 날입니다.")],
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

      interaction.reply({ embeds: [embeds] });
    } catch (e) {
      console.log(e);
      const embeds = new MessageEmbed().setTitle("오류가 생겼습니다.");
      await interaction.reply({ embeds: [embeds], fetchReply: true });
    }
  }
}
