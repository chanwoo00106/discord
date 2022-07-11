import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { githubUser } from "src/graphql/githubUser";
import github from "src/lib/github";
import { Github } from "src/types";

export const data = new SlashCommandBuilder()
  .setName("github_user")
  .setDescription("github 정보 가져오기")
  .addStringOption((option) =>
    option.setName("id").setDescription("깃헙 아이디").setRequired(true)
  );

export async function execute(interaction: CommandInteraction) {
  const id = interaction.options.getString("id");

  if (!id) return;

  const { user } = await github.request<Github>(githubUser(id));

  return new MessageEmbed()
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
}
