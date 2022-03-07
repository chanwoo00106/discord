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
        Math.floor(date.getMonth() + 1) / 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      const day =
        Math.floor(date.getDate()) / 10 ? "0" + date.getDate() : date.getDate();
      const queryUrl =
        process.env.SCHEDULE_API + `${date.getFullYear()}${month}${day}`;
      const { data }: { data: scheduleType } = await axios.get(queryUrl);

      if (!data.hisTimetable) {
        interaction.reply({
          embeds: [new MessageEmbed().setTitle("수업이 없는 날입니다.")],
        });
      }

      const Class = data.hisTimetable[1].row?.map((i) => i.ITRT_CNTNT);

      let result = "";

      Class?.map((i) => (result += `${i}\n`));

      const embeds = new MessageEmbed()
        .setTitle(`${date.getFullYear()}년 ${month}윌 ${day}일 시간표`)
        .setDescription(result);

      interaction.reply({ embeds: [embeds] });
    } catch (e) {
      console.log(e);
      const embeds = new MessageEmbed().setTitle("오류가 생겼습니다.");
      interaction.reply({ embeds: [embeds] });
    }
  }
}
