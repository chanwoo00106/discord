import { addDoc, collection } from "firebase/firestore/lite";
import { db } from "src/firebase";

export async function addGuild(guildName: string, guildId: string) {
  try {
    await addDoc(collection(db, "discord"), {
      [guildName]: guildId,
    });
  } catch (e) {
    console.log(e);
  }
}
