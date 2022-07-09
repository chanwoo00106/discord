import { getDoc, doc } from "firebase/firestore/lite";
import { db } from "src/firebase";

export const findAllGuilds = async () =>
  (await getDoc(doc(db, "discord", "guilds"))).data();
