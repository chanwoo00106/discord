import { Client } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import dotenv from "dotenv";
import { SlashCommandBuilder } from "@discordjs/builders";
import { user, vs } from "./lib/command";

dotenv.config();

const commands = [
  new SlashCommandBuilder()
    .setName("user")
    .setDescription("You can search for users on github.")
    .addStringOption((str) => str.setName("id").setDescription("github id")),
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
  new SlashCommandBuilder()
    .setName("vs")
    .setDescription("graph")
    .addStringOption((str) => str.setName("id1").setDescription("github id"))
    .addStringOption((str) => str.setName("id2").setDescription("github id")),
].map((command) => command.toJSON());

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

client.on("ready", () => {
  console.log(`${client.user.tag}에 로그인하였습니다!`);

  (async () => {
    try {
      if (process.env.ENV === "production") {
        await rest.put(Routes.applicationCommands(client.user.id), {
          body: commands,
        });
      } else {
        await rest.put(
          Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID),
          {
            body: commands,
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  })();
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === "ping") {
    await interaction.reply("Pong!");
  } else if (commandName === "user") {
    const embed = await user(options.getString("id"));
    interaction.reply({ embeds: [embed] });
  } else if (commandName === "vs") {
    const result = await vs(options.getString("id1"), options.getString("id2"));
    if (typeof result !== "string") {
      interaction.reply({ embeds: [result] });
    }
    interaction.reply(result);
  }
});

client.login(process.env.BOT_TOKEN);
