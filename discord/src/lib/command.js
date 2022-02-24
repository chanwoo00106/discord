import { GraphQLClient } from "graphql-request";
import { MessageEmbed } from "discord.js";
import { userQuery } from "./query";
import { GITHUB_API } from "../../secret";

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
