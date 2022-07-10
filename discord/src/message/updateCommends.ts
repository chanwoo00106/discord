import { Message } from "discord.js";
import config from "src/config";
import { findAllGuilds } from "src/firebase/index";
import { commandDeploy } from "src/commands-deploy";

export async function execute(message: Message) {
  try {
    if (
      message.guild?.id !== config.GUILD_ID &&
      message.member?.id === config.MASTER_ID
    )
      return;

    const data = await findAllGuilds();

    console.log(data);

    // if (!data) return;
    //
    // Object.keys(data).map((i) => {
    //   commandDeploy(data[i]);
    // });
  } catch (e) {
    console.log(e);
  }
}
