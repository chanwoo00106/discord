import { updateDoc, doc, deleteField } from "firebase/firestore/lite";
import { db } from "src/firebase";

export async function deleteGuild(guildId: string) {
  try {
    await updateDoc(doc(db, "discord", "guilds"), {
      [guildId]: deleteField(),
    });
  } catch (e) {
    console.log(e);
  }
}
