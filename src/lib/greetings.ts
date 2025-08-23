import { db } from "./firebase";
import { ref, push, onValue, DataSnapshot } from "firebase/database";

export interface GreetingData {
  name: string;
  message: string;
  createdAt?: number;
}

export const submitGreeting = async (data: GreetingData) => {
  try {
    const greetingsRef = ref(db, "users/adilfi-lukman/ucapan");
    await push(greetingsRef, {
      name: data.name,
      message: data.message,
      createdAt: Date.now(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error submitting greeting:", error);
    return { success: false, error };
  }
};

export const listenGreetings = (callback: (data: GreetingData[]) => void) => {
  const greetingsRef = ref(db, "users/adilfi-lukman/ucapan");

  return onValue(greetingsRef, (snapshot: DataSnapshot) => {
    const val = snapshot.val();
    if (!val) {
      callback([]);
      return;
    }

    const formatted: GreetingData[] = Object.values(val) as GreetingData[];
    // urutkan dari terbaru ke lama
    formatted.sort((a: GreetingData, b: GreetingData) => (b?.createdAt ?? 0) - (a.createdAt ?? 0));

    callback(formatted);
  });
};
