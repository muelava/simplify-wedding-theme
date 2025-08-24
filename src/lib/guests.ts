import { db } from "./firebase";
import { ref, push, onValue, DataSnapshot, remove } from "firebase/database";

export interface GuestData {
  id?: string;
  name: string;
  invitedBy?: string;
  createdAt?: number;
}

// Simpan tamu baru
export const addGuest = async (data: GuestData) => {
  try {
    const guestsRef = ref(db, "users/adilfi-lukman/daftar-tamu");
    const newRef = await push(guestsRef, {
      name: data.name,
      invitedBy: data.invitedBy ?? "system",
      createdAt: Date.now(),
    });
    return { success: true, id: newRef.key };
  } catch (error) {
    console.error("Error adding guest:", error);
    return { success: false, error };
  }
};

// Dengarkan perubahan daftar tamu
export const listenGuests = (callback: (data: GuestData[]) => void) => {
  const guestsRef = ref(db, "users/adilfi-lukman/daftar-tamu");

  return onValue(guestsRef, (snapshot: DataSnapshot) => {
    const val = snapshot.val();
    if (!val) {
      callback([]);
      return;
    }

    const formatted: GuestData[] = Object.entries(val).map(([id, g]: [string, any]) => ({
      id,
      ...g,
    }));

    // urutkan dari terbaru ke lama
    formatted.sort((a, b) => (b?.createdAt ?? 0) - (a?.createdAt ?? 0));

    callback(formatted);
  });
};

// Hapus tamu
export const deleteGuest = async (id: string) => {
  try {
    const guestRef = ref(db, `users/adilfi-lukman/daftar-tamu/${id}`);
    await remove(guestRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting guest:", error);
    return { success: false, error };
  }
};
