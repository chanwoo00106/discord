import { CommandInteraction, MessageEmbed } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { GithubType } from "../types/github";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const api = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_API}`,
  },
});

@Discord()
@SlashGroup({ name: "github", description: "github 정보 긁어오기" })
abstract class AppDiscord {
  @Slash("user")
  @SlashGroup("github")
  async github(
    @SlashOption("id", { description: "github id" }) id: string,
    interaction: CommandInteraction
  ) {
    try {
      const { data }: { data: GithubType } = await api.get(`/users/${id}`);
      const embeds = new MessageEmbed()
        .setColor("#fff")
        .setTitle(data.name || data.login)
        .setURL(data.url)
        .setDescription(data.bio || "아직 bio가 없어요!")
        .setThumbnail(data.avatar_url)
        .addFields(
          {
            name: "company",
            value: data.company || "아직 회사가 없어요",
          },
          { name: "location", value: data.location || "아직 사는 곳이 없어요" }
        )
        .setTimestamp()
        .setFooter({
          text: data.name || data.login,
          iconURL: data.avatar_url,
        });
      interaction.reply({ embeds: [embeds] });
    } catch (e) {
      interaction.reply("존재하지 않는 id입니다");
    }
  }
}
