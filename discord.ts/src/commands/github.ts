import { CommandInteraction, MessageEmbed } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { UserInfoI } from "../types/github";
import { Repos } from "../types/repo";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_API}`,
  },
  cache: new InMemoryCache(),
});

export function UserInfo(id: string): string {
  return `query {
	user(login:"${id}") {
    name
    login
    bio
    company
    avatarUrl
    location
    url
	}
}`;
}

export function Contribution(id: string) {
  return `query {
  user(login: "${id}") {
    login
    name
    contributionsCollection {
      contributionCalendar{
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
  }
}`;
}

@Discord()
@SlashGroup({ name: "github", description: "github 정보 긁어오기" })
export abstract class GithubDiscord {
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
    const user1: Repos = await client.query({
      query: gql`
        ${Contribution(id1)}
      `,
    });
    const user2: Repos = await client.query({
      query: gql`
        ${Contribution(id2)}
      `,
    });

    console.log(user1.data.user.name);
  }
}
