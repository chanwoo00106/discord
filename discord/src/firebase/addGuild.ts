import { setDoc, doc } from "firebase/firestore/lite";
import { db } from "src/firebase";
import { findAllGuilds } from "./findAllGuilds";

export async function addGuild(guildName: string, guildId: string) {
  const guilds = await findAllGuilds();
  try {
    await setDoc(doc(db, "discord", "guilds"), {
      ...guilds,
      [guildId]: guildName,
    });
  } catch (e) {
    console.log(e);
  }
}
