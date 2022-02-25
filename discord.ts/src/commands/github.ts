import { CommandInteraction, MessageEmbed } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { UserInfoI } from "../types/github";
import { Repos } from "../types/repo";
import { GraphQLClient, gql } from "graphql-request";

const client = new GraphQLClient("https://api.github.com/graphql");

client.setHeader("Authorization", `Bearer ${process.env.GITHUB_API}`);

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
      const { user }: UserInfoI = await client.request(
        gql`
          ${UserInfo(id)}
        `
      );
      const embeds = new MessageEmbed()
        .setColor("#f6e58d")
        .setTitle(user.name || user.login)
        .setURL(user.url)
        .setDescription(user.bio || "아직 bio가 없어요!")
        .setThumbnail(user.avatarUrl)
        .addFields(
          {
            name: "company",
            value: user.company || "아직 회사가 없어요!",
          },
          {
            name: "location",
            value: user.location || "아직 사는 곳이 없어요!",
          },
          {
            name: "총 커밋",
            value: `${user.contributionsCollection.contributionCalendar.totalContributions}`,
            inline: true,
          },
          {
            name: "총 레포 개수",
            value: `${user.repositories.totalCount}`,
            inline: true,
          }
        )
        .setTimestamp()
        .setFooter({
          text: user.name || user.login,
          iconURL: user.avatarUrl,
        });
      interaction.reply({ embeds: [embeds] });
    } catch (e) {
      const embeds = new MessageEmbed()
        .setColor("#EA2027")
        .setTitle(`${id}은(는) 존재하지 않는 id입니다`);
      interaction.reply({ embeds: [embeds] });
    }
  }

  @Slash("vs")
  @SlashGroup("github")
  async vs(
    @SlashOption("id1", { description: "github id" }) id1: string,
    @SlashOption("id2", { description: "github id" }) id2: string,
    interaction: CommandInteraction
  ) {
    try {
      const user1: Repos = (
        await client.request(
          gql`
            ${Contribution(id1)}
          `
        )
      ).user;
      const user2: Repos = (
        await client.request(
          gql`
            ${Contribution(id2)}
          `
        )
      ).user;

      const data1 = makeArray(user1);
      const data2 = makeArray(user2);

      interaction.reply(
        makeUrl(
          data1,
          data2,
          user1.name || user1.login,
          user2.name || user1.login,
          user1.contributionsCollection.contributionCalendar.weeks[0]
            .contributionDays[0].date
        )
      );
    } catch (e) {
      const embeds = new MessageEmbed()
        .setColor("#EA2027")
        .setTitle(`존재하지 않는 id입니다`);
      interaction.reply({ embeds: [embeds] });
    }
  }

  @Slash("repo")
  @SlashGroup("github")
  async repos(
    @SlashOption("id", { description: "github id" }) id: string,
    interaction: CommandInteraction
  ) {
    try {
      const { user } = await client.request(repos(id));

      const embeds = new MessageEmbed()
        .setColor("#b8e994")
        .setTitle(user.name || user.login)
        .setURL(`${user.url}?tab=repositories`)
        .setDescription(`총 레포 수: ${user.repositories.totalCount}`)
        .setThumbnail(user.avatarUrl)
        .addFields(
          user.repositories.nodes.map((i: any) => ({
            name: i.name,
            value: i.description || "설명이 없어요!",
          }))
        )
        .setTimestamp()
        .setFooter({
          text: user.name || user.login,
          iconURL: user.avatarUrl,
        });

      interaction.reply({ embeds: [embeds] });
    } catch (e) {
      const embeds = new MessageEmbed()
        .setColor("#EA2027")
        .setTitle(`${id}은(는) 존재하지 않는 id입니다`);

      interaction.reply({ embeds: [embeds] });
    }
  }
}

function makeArray(user: Repos): number[] {
  const one = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let MonthTemp = new Date().getMonth();
  let position = 0;

  user.contributionsCollection.contributionCalendar.weeks.map((i) => {
    i.contributionDays.forEach((j) => {
      if (MonthTemp !== new Date(j.date).getMonth()) {
        MonthTemp = new Date(j.date).getMonth();
        position += 1;
      }
      one[position] += j.contributionCount;
    });
  });

  return one;
}

function UserInfo(id: string): string {
  return `query {
	user(login:"${id}") {
    name
      login
      bio
      company
      avatarUrl
      location
      url
      repositories {
        totalCount
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
        }
      }
	}
}`;
}

function Contribution(id: string) {
  return `query {
  user(login: "${id}") {
    login
    name
    contributionsCollection {
      contributionCalendar{
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

function repos(id: string) {
  return `query {
    user(login: "${id}") {
      login
      name
      avatarUrl
      url
      repositories(first: 4, orderBy: { field: PUSHED_AT, direction: DESC }) {
        nodes {
          name
          description
        }
        totalCount
      }
    }
  }`;
}

function makeUrl(
  one: number[],
  two: number[],
  name1: string,
  name2: string,
  firstDate: string
) {
  const month = new Date(firstDate).getMonth();

  const result = makeMonthArray(month);

  return `https://quickchart.io/chart?c={type:'line',data:{labels:[${result.map(
    (i: any) => `\'${i}\'`
  )}],datasets:[{label:'${name1}',data:[${one}],fill:false,borderColor:'blue'},{label:'${name2}',data:[${two}],fill:false,borderColor:'green'}]}}`;
}

function makeMonthArray(month: number) {
  const monthArray: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  for (let i = 0; i < month; i++) {
    const temp = monthArray.shift();
    if (temp) monthArray.push(temp);
  }

  monthArray.push(monthArray[0]);

  return monthArray;
}
