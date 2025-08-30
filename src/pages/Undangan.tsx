import { useEffect, useMemo, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Copy, Whatsapp } from "iconsax-react";
import { Share2, Trash } from "lucide-react";
import { enUS, id } from "date-fns/locale";
import { addGuest, deleteGuest, listenGuests, type GuestData } from "../lib/guests";
import toast from "react-hot-toast";

// Informasi acara + link undangan
const eventInfo = {
  catin1: "Adilfi Wicaksani",
  catin2: "Lukman Muhamad Ismail",
  // ISO date biar gampang diformat
  date: "2025-09-14T11:00:00+07:00",
  time: "11:00 WIB - Selesai",
  place: `Kp. Loji RT. 01 / RW. 05 Desa Limbangan Timur Kec. limbangan, Bl. Limbangan, Kab. Garut-44186 (Belakang Polsek Limbangan)`,
  getInvitationLink: (guestName: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}?to=${encodeURIComponent(guestName)}`;
  },
};

// Format tanggal Indonesia
const formattedDateID = format(new Date(eventInfo.date), "EEEE, dd MMMM yyyy", {
  locale: id,
});

// Format tanggal English
const formattedDateEN = format(new Date(eventInfo.date), "EEEE, dd MMMM yyyy", {
  locale: enUS,
});

// Format jam English (AM/PM)
const formattedTimeEN = format(new Date(eventInfo.date), "hh:mm a", {
  locale: enUS,
});

const templates = {
  formal: `Kepada Yth. Bapak/Ibu/Saudara/i *[nama]*

Dengan hormat,

Tanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada acara pernikahan kami:

🕊️ *${eventInfo.catin1}*
&
🕊️ *${eventInfo.catin2}*

Yang insyaaAllah akan dilaksanakan pada:

📅 Hari/Tanggal : ${formattedDateID}
🕒 Waktu        : ${eventInfo.time}
📍 Tempat       : ${eventInfo.place}

Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dalam acara tersebut.

Tautan undangan: *[link]*

Atas perhatian dan kehadirannya, kami ucapkan terima kasih.

Hormat kami,
*[nama_pengundang]*`,

  muslim: `بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ

Assalamu’alaikum Warahmatullahi Wabarakatuh
Kepada Yth. Bapak/Ibu/Saudara/i *[nama]*

Dengan memohon rahmat dan ridho Allah SWT, izinkan kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara pernikahan putra-putri kami:

🕊️ *${eventInfo.catin1}*
&
🕊️ *${eventInfo.catin2}*

Yang insyaaAllah akan dilaksanakan pada:

📅 Hari/Tanggal : ${formattedDateID}
🕒 Waktu        : ${eventInfo.time}
📍 Tempat       : ${eventInfo.place}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu kepada kedua mempelai.

Tautan undangan: *[link]*

Wassalamu’alaikum Warahmatullahi Wabarakatuh

Hormat kami,
*[nama_pengundang]*`,

  englishFormal: `Dear Mr./Mrs./Ms. *[nama]*,

With great pleasure, we would like to invite you to attend and give your blessings at our wedding ceremony:

🕊️ *${eventInfo.catin1}*
&
🕊️ *${eventInfo.catin2}*

Which, God willing, will be held on:

📅 Date    : ${formattedDateEN}
🕒 Time    : ${formattedTimeEN} (until finished)
📍 Venue   : ${eventInfo.place}

It would be an honor and a great joy for us if you could join this special occasion.

Invitation link: *[link]*

Sincerely,
*[nama_pengundang]*`,
};

interface Guest extends GuestData {
  id: string;
  name: string;
  invitedBy?: string;
}

export const SebarUndangan = () => {
  const [formData, setFormData] = useState({
    nama: "Adilfi & Lukman",
    listNama: "",
    pilihan: "formal",
    textInvitation: templates.formal,
  });
  const [guests, setGuests] = useState<Guest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Listen to Firebase changes
  useEffect(() => {
    const unsubscribe = listenGuests((firebaseGuests: GuestData[]) => {
      const formattedGuests: Guest[] = firebaseGuests.map((g) => ({
        id: g.id || "",
        name: g.name,
        invitedBy: g.invitedBy,
        createdAt: g.createdAt,
      }));
      setLoading(false);
      setGuests(formattedGuests);
    });

    return () => unsubscribe();
  }, []);

  // Fungsi untuk memfilter tamu berdasarkan pencarian
  const filteredGuests = useMemo(() => {
    if (!searchTerm) return guests;

    return guests.filter((guest) => guest.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [guests, searchTerm]);

  // handle input / textarea umum
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // khusus handle radio
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      pilihan: value,
      textInvitation: templates[value as keyof typeof templates],
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const daftarNama = formData.listNama
      .split("\n")
      .map((n) => n.trim())
      .filter((n) => n !== "");

    for (const name of daftarNama) {
      const guestData: GuestData = {
        name,
        invitedBy: formData.nama,
      };

      await addGuest(guestData);
    }

    setFormData((prev) => ({
      ...prev,
      listNama: "",
    }));

    toast.success("Daftar Nama Tamu Berhasil ditambahkan");
  };

  // ---- ACTIONS ----
  const buildMessage = (guestName: string) => {
    const template = formData.textInvitation;
    const link = eventInfo.getInvitationLink(guestName);

    return template.replace("*[nama]*", guestName).replace("*[nama_pengundang]*", formData.nama).replace("*[link]*", link);
  };

  const handleWhatsapp = (guestName: string) => {
    const message = buildMessage(guestName);
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleShare = async (guestName: string) => {
    const message = buildMessage(guestName);
    if (navigator.share) {
      await navigator.share({
        title: "Undangan",
        text: message,
      });
    } else {
      toast.error("Fitur share tidak tersedia di browser ini");
    }
  };

  const handleCopy = async (guestName: string) => {
    const message = buildMessage(guestName);
    await navigator.clipboard.writeText(message);
    toast.success(`Teks undangan untuk ${guestName} berhasil disalin`);
  };

  const handleDelete = async (id: string) => {
    const result = await deleteGuest(id);
    if (result.success) {
      setGuests((prev) => prev.filter((g) => g.id !== id));
    }
  };

  return (
    <main className="grid grid-cols-1 lg:grid-cols-2">
      {/* Form Tamu */}
      <section className="w-full max-md:max-w-lg mx-auto p-4 lg:p-10 min-lg:h-full min-lg:max-h-screen min-lg:relative min-lg:overflow-y-auto mb-10 lg:mb-0">
        <form onSubmit={handleSubmit}>
          {/* Nama Pengundang */}
          <div className="mb-5 text-[#6A6357]" style={{ fontFamily: '"Adamina", serif' }}>
            <label htmlFor="nama" className="block font-normal mb-1">
              Nama Pengundang:
            </label>
            <input type="text" id="nama" placeholder="Nama" value={formData.nama} onChange={handleChange} className="border border-[#AA9B13] bg-white w-full p-2 rounded" />
          </div>

          {/* List Nama Undangan */}
          <div className="mb-5 text-[#6A6357]" style={{ fontFamily: '"Adamina", serif' }}>
            <label htmlFor="listNama" className="block font-normal mb-1">
              List Nama Undangan <br />
              <small className="text-xs italic">*Gunakan baris baru (↵) untuk memisahkan nama yang akan diundang.</small>
            </label>
            <textarea id="listNama" value={formData.listNama} onChange={handleChange} className="border border-[#AA9B13] bg-white w-full p-2 rounded min-h-30 field-sizing-content" placeholder="Denis ↵" />
          </div>

          {/* Pilihan Text */}
          <div className="flex gap-x-3 mb-3 text-[#6A6357]" style={{ fontFamily: '"Adamina", serif' }}>
            <div className="flex gap-x-1.5">
              <input type="radio" id="formal" name="pilihan" value="formal" checked={formData.pilihan === "formal"} onChange={handleRadioChange} className="peer/formal" />
              <label htmlFor="formal" className="text-[#AA9B13] peer-checked/formal:text-[#6A6357] cursor-pointer">
                Formal
              </label>
            </div>
            <div className="flex gap-x-1.5">
              <input type="radio" id="muslim" name="pilihan" value="muslim" checked={formData.pilihan === "muslim"} onChange={handleRadioChange} className="peer/muslim" />
              <label htmlFor="muslim" className="text-[#AA9B13] peer-checked/muslim:text-[#6A6357] cursor-pointer">
                Muslim
              </label>
            </div>
            <div className="flex gap-x-1.5">
              <input type="radio" id="englishFormal" name="pilihan" value="englishFormal" checked={formData.pilihan === "englishFormal"} onChange={handleRadioChange} className="peer/englishFormal" />
              <label htmlFor="englishFormal" className="text-[#AA9B13] peer-checked/englishFormal:text-[#6A6357] cursor-pointer">
                English
              </label>
            </div>
          </div>

          {/* Isi Teks Pengantar */}
          <div className="text-[#6A6357]" style={{ fontFamily: '"Adamina", serif' }}>
            <label htmlFor="textInvitation" className="block font-normal mb-1">
              Isi Teks Pengantar
            </label>
            <textarea id="textInvitation" value={formData.textInvitation} onChange={handleChange} className="border border-[#AA9B13] bg-white w-full p-2 rounded min-h-30 field-sizing-content" />
          </div>

          {/* Tombol Submit */}
          <div className="sticky bottom-0 p-3">
            <button
              type="submit"
              className="flex items-center shadow-lg justify-center gap-x-1 bg-[#fefced] border-2 font-light text-lg uppercase border-[#BF9E50] rounded-full w-full py-1 text-[#6a6357] cursor-pointer hover:bg-[#FFEECE] hover:text-[#24364D] transition-colors duration-300"
              style={{
                fontFamily: '"Anaheim", sans-serif',
                fontOpticalSizing: "auto",
              }}
            >
              Buat Daftar Nama
            </button>
          </div>
        </form>
      </section>

      {/* List tamu */}
      <div className="h-full max-h-[60vh] lg:max-h-screen overflow-y-auto w-full max-w-lg mx-auto relative px-3 lg:pt-10">
        {/* Input Pencarian */}
        <div className="mb-4 text-[#6A6357]" style={{ fontFamily: '"Adamina", serif' }}>
          <label htmlFor="search" className="block font-normal mb-1">
            Cari Tamu:
          </label>
          <input type="text" id="search" placeholder="Masukkan nama tamu..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border border-[#AA9B13] bg-white w-full p-2 rounded" />
        </div>
        <table className="table table-auto w-full">
          <thead className="sticky w-full top-0 lg:-top-10">
            <tr>
              <th className="text-start bg-amber-50 p-3 text-neutral-600 font-normal rounded-s-lg w-full">Nama Tamu ({filteredGuests.length})</th>
              <th className="text-center bg-amber-50 p-3 text-neutral-600 font-normal rounded-e-lg">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={2} className="text-center text-gray-500 py-3">
                  {/* <p className="mb-2">Memuat..</p>
                  <div className="flex justify-center space-x-2 mx-auto">
                    <div className="size-1.5 bg-[#6A6357] rounded-full animate-ping"></div>
                    <div className="size-1.5 bg-[#6A6357] rounded-full animate-ping" style={{ animationDelay: "0.1s" }}></div>
                    <div className="size-1.5 bg-[#6A6357] rounded-full animate-ping" style={{ animationDelay: "0.2s" }}></div>
                  </div> */}
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center w-full bg-gradient-to-r from-orange-100/70 to-orange-50/70 p-3 rounded-xl mb-3">
                      <div className="flex-auto">
                        <div className="h-4 mb-2 rounded-full w-2/5 bg-gray-200 animate-pulse"></div>
                        <div className="h-3 w-2/4 rounded-full bg-gray-200 animate-pulse"></div>
                      </div>
                      <div className="flex gap-x-1 animate-pulse">
                        <div className="size-9 bg-gray-200 rounded-full"></div>
                        <div className="size-9 bg-gray-200 rounded-full"></div>
                        <div className="size-9 bg-gray-200 rounded-full"></div>
                        <div className="size-9 bg-gray-200 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </td>
              </tr>
            )}

            {!loading && filteredGuests.length === 0 ? (
              <tr>
                <td colSpan={2} className="p-3 text-center text-gray-500">
                  Belum ada tamu
                </td>
              </tr>
            ) : (
              filteredGuests.map((guest) => (
                <tr key={guest.id}>
                  <td className="p-3 align-middle">
                    <p className="text-sm md:text-base font-medium">{guest.name}</p>
                    <small className="text-xs md:text-sm opacity-70">{guest.createdAt ? formatDistanceToNow(new Date(guest.createdAt), { addSuffix: false, locale: id }) : ""} yang lalu</small>
                  </td>
                  <td className="p-3 flex gap-x-1 items-center align-middle">
                    <button onClick={() => handleWhatsapp(guest.name)} className="bg-emerald-400 rounded-full shadow-lg p-2 hover:bg-emerald-500 cursor-pointer transition-colors duration-300">
                      <Whatsapp color="#fff" className="size-5 lg:size-5" />
                    </button>
                    <button onClick={() => handleShare(guest.name)} className="bg-[#fefced] rounded-full shadow-lg p-2 hover:bg-[#FFEECE] cursor-pointer transition-colors duration-300">
                      <Share2 color="#6a6357" className="size-5 lg:size-5" />
                    </button>
                    <button onClick={() => handleCopy(guest.name)} className="bg-[#fefced] rounded-full shadow-lg p-2 hover:bg-[#FFEECE] cursor-pointer transition-colors duration-300">
                      <Copy className="size-5 lg:size-5" color="#6a6357" />
                    </button>
                    <button onClick={() => handleDelete(guest.id)} className="bg-rose-300 rounded-full shadow-lg p-2 hover:bg-rose-400 cursor-pointer transition-colors duration-300">
                      <Trash className="size-5 lg:size-5" color="#fff" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};
