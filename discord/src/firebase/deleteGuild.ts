import { updateDoc, doc, deleteField } from "firebase/firestore/lite";
import { db } from "src/firebase";

export async function deleteGuild(guildName: string) {
  try {
    await updateDoc(doc(db, "discord", "guilds"), {
      [guildName]: deleteField(),
    });
  } catch (e) {
    console.log(e);
  }
}
