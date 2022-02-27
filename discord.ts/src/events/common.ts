import type { ArgsOf } from "discordx";
import { Discord, On, Client } from "discordx";

@Discord()
export abstract class AppDiscord {
  @On("messageDelete")
  onMessage([message]: ArgsOf<"messageDelete">, client: Client) {
    console.log("Message Deleted", client.user?.username, message.content);
  }
  @On("message")
  async sayMessage([message]: ArgsOf<"messageDelete">, client: Client) {
    if (message.content === "형우") message.reply("씹덕");
  }
}
