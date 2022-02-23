import { CommandInteraction, MessageEmbed } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { GithubType } from "../types/github";
import { Repo } from "../types/repo";
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
        .setColor("#f6e58d")
        .setTitle(data.name || data.login)
        .setURL(data.html_url)
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

  @Slash("repos")
  @SlashGroup("github")
  async repo(
    @SlashOption("id", { description: "github id" }) id: string,
    interaction: CommandInteraction
  ) {
    const { data }: { data: Repo[] } = await api.get(
      `/users/${id}/repos?per_page=4&sort=updated`
    );
    const embeds = new MessageEmbed()
      .setTitle(`${id}의 repos`)
      .setThumbnail(data[0].owner.avatar_url)
      .setColor("#dff9fb")
      .addFields(
        data.map((repo) => ({
          name: repo.name,
          value: repo.html_url,
        }))
      )
      .setTimestamp()
      .setFooter({
        text: data[0].owner.login,
        iconURL: data[0].owner.avatar_url,
      });
    interaction.reply({ embeds: [embeds] });
  }
}
