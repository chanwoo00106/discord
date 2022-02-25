import { GraphQLClient } from "graphql-request";
import { MessageEmbed } from "discord.js";
import { userQuery, vsQuery } from "./query";
import { GITHUB_API } from "../../secret";
import { makeUrl } from "./makeUrl";

const client = new GraphQLClient("https://api.github.com/graphql");

client.setHeader("Authorization", `Bearer ${GITHUB_API}`);

export async function user(id) {
  try {
    const { user } = await client.request(userQuery, { id });

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

    return embeds;
  } catch (e) {
    console.log(e);
    const embeds = new MessageEmbed()
      .setColor("#EA2027")
      .setTitle("존재하지 않는 id입니다");

    return embeds;
  }
}

export async function vs(id1, id2) {
  try {
    const one = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const two = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let MonthTemp = new Date().getMonth();
    let position = 0;

    const data1 = (await client.request(vsQuery, { id: id1 })).user;
    const data2 = (await client.request(vsQuery, { id: id2 })).user;

    data1.contributionsCollection.contributionCalendar.weeks.map((i) => {
      i.contributionDays.forEach((j) => {
        if (MonthTemp !== new Date(j.date).getMonth()) {
          MonthTemp = new Date(j.date).getMonth();
          position += 1;
        }
        one[position] += j.contributionCount;
      });
    });

    MonthTemp = new Date().getMonth();
    position = 0;

    data2.contributionsCollection.contributionCalendar.weeks.map((i) => {
      i.contributionDays.forEach((j) => {
        if (MonthTemp !== new Date(j.date).getMonth()) {
          MonthTemp = new Date(j.date).getMonth();
          position += 1;
        }
        two[position] += j.contributionCount;
      });
    });

    return makeUrl(
      one,
      two,
      data1.name || data1.login,
      data2.name || data2.login,
      data1.contributionsCollection.contributionCalendar.weeks[0]
        .contributionDays[0].date
    );
  } catch (e) {
    console.log(e);
    const embeds = new MessageEmbed()
      .setColor("#EA2027")
      .setTitle("존재하지 않는 id입니다");

    return embeds;
  }
}