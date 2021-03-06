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
      await interaction.reply({ embeds: [embeds], fetchReply: true });
    } catch (e) {
      console.log(e);
      const embeds = new MessageEmbed()
        .setColor("#EA2027")
        .setTitle(`${id}은(는) 존재하지 않는 id입니다`);
      await interaction.reply({ embeds: [embeds], fetchReply: true });
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

      const data1 = makeArray(user1, "year");
      const data2 = makeArray(user2, "year");

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
      console.log(e);
      const embeds = new MessageEmbed()
        .setColor("#EA2027")
        .setTitle(`존재하지 않는 id입니다`);
      await interaction.reply({ embeds: [embeds], fetchReply: true });
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

      await interaction.reply({ embeds: [embeds], fetchReply: true });
    } catch (e) {
      console.log(e);
      const embeds = new MessageEmbed()
        .setColor("#EA2027")
        .setTitle(`${id}은(는) 존재하지 않는 id입니다`);

      await interaction.reply({ embeds: [embeds], fetchReply: true });
    }
  }

  @Slash("vs_month")
  @SlashGroup("github")
  async vsMonth(
    @SlashOption("id1", { description: "github id" }) id1: string,
    @SlashOption("id2", { description: "github id" }) id2: string,
    interaction: CommandInteraction
  ) {
    const date = new Date();
    const to = new Date().toISOString();
    const from = new Date(date.setMonth(date.getMonth() - 1)).toISOString();

    try {
      const user1: Repos = (
        await client.request(vsMonth, { id: id1, from, to })
      ).user;
      const user2: Repos = (
        await client.request(vsMonth, { id: id2, from, to })
      ).user;

      const { data1, monthArray } = makeCountAndMonthArray(user1);
      const data2 = makeArray(user2, "month");

      const url =
        `https://quickchart.io/chart?c={type:'line',data:{labels:[${monthArray.map(
          (date) => new Date(date).getDate()
        )}],datasets:[{label:'${
          user1.name || user1.login
        }',data:[${data1}],fill:false,borderColor:'blue'},{label:'${
          user2.name || user2.login
        }',data:[${data2}],fill:false,borderColor:'green'}]}}`.trim();

      await interaction.reply(url);
    } catch (e) {
      console.log(e);
      const embeds = new MessageEmbed()
        .setColor("#EA2027")
        .setTitle(`존재하지 않는 id입니다`);

      await interaction.reply({ embeds: [embeds], fetchReply: true });
    }
  }
}

function makeArray(user: Repos, type: "year" | "month"): number[] {
  if (type === "year") {
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
  } else {
    const countArray: number[] = [];
    user.contributionsCollection.contributionCalendar.weeks.map((i) => {
      i.contributionDays.forEach((j) => {
        countArray.push(j.contributionCount);
      });
    });
    return countArray;
  }
}

function makeCountAndMonthArray(user: Repos): {
  data1: number[];
  monthArray: string[];
} {
  const data1: number[] = [];
  const monthArray: string[] = [];
  user.contributionsCollection.contributionCalendar.weeks.map((i) => {
    i.contributionDays.forEach((j) => {
      data1.push(j.contributionCount);
      monthArray.push(j.date);
    });
  });
  return { data1, monthArray };
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

const vsMonth = gql`
  query ($id: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $id) {
      name
      login
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`;

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
  )}],datasets:[{label:'${name1}',data:[${one}],fill:false,borderColor:'blue'},{label:'${name2}',data:[${two}],fill:false,borderColor:'green'}]}}`.trim();
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
