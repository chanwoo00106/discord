import { setDoc, doc } from "firebase/firestore/lite";
import { db } from "src/firebase";

export async function addGuild(guildName: string, guildId: string) {
  try {
    await setDoc(doc(db, "discord", "guilds"), {
      [guildName]: guildId,
    });
  } catch (e) {
    console.log(e);
  }
}
