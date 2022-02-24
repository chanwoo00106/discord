import { CommandInteraction, MessageEmbed } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { GithubType, UserInfoI } from "../types/github";
import { Repo } from "../types/repo";
import dotenv from "dotenv";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
import { UserInfo } from "../query/user";

dotenv.config();

const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_API}`,
  },
  cache: new InMemoryCache(),
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
      const {
        data: { user },
      }: UserInfoI = await client.query({
        query: gql`
          ${UserInfo(id)}
        `,
      });
      const embeds = new MessageEmbed()
        .setColor("#f6e58d")
        .setTitle(user.name || user.login)
        .setURL(user.url)
        .setDescription(user.bio || "아직 bio가 없어요!")
        .setThumbnail(user.avatarUrl)
        .addFields(
          {
            name: "company",
            value: user.company || "아직 회사가 없어요",
          },
          { name: "location", value: user.location || "아직 사는 곳이 없어요" }
        )
        .setTimestamp()
        .setFooter({
          text: user.name || user.login,
          iconURL: user.avatarUrl,
        });
      interaction.reply({ embeds: [embeds] });
    } catch (e) {
      interaction.reply("존재하지 않는 id입니다");
    }
  }

  @Slash("vs")
  @SlashGroup("github")
  async repo(
    @SlashOption("id1", { description: "github id" }) id1: string,
    @SlashOption("id2", { description: "github id" }) id2: string,
    interaction: CommandInteraction
  ) {
    // const { data }: { data: Repo[] } = await api.get(
    //   `/users/${id}/repos?per_page=4&sort=updated`
    // );
    // const embeds = new MessageEmbed()
    //   .setTitle(`${id}의 repos`)
    //   .setThumbnail(data[0].owner.avatar_url)
    //   .setColor("#dff9fb")
    //   .addFields(
    //     data.map((repo) => ({
    //       name: repo.name,
    //       value: repo.html_url,
    //     }))
    //   )
    //   .setTimestamp()
    //   .setFooter({
    //     text: data[0].owner.login,
    //     iconURL: data[0].owner.avatar_url,
    //   });
    // interaction.reply({ embeds: [embeds] });
  }
}
