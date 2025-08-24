import { useState } from "react";
import { format } from "date-fns";
import { Copy, Whatsapp } from "iconsax-react";
import { Share2, Trash } from "lucide-react";
import { enUS, id } from "date-fns/locale";

// Informasi acara + link undangan
const eventInfo = {
  catin1: "Adilfi Wicaksani",
  catin2: "Lukman Muhamad Ismail",
  // ISO date biar gampang diformat
  date: "2025-09-14T11:00:00+07:00",
  time: "11:00 WIB - Selesai",
  place: "Limbangan, Garut",
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
*${eventInfo.catin1.split(" ")[0]} & ${eventInfo.catin2.split(" ")[0]}*`,

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
*${eventInfo.catin1.split(" ")[0]} & ${eventInfo.catin2.split(" ")[0]}*`,

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
*${eventInfo.catin1.split(" ")[0]} & ${eventInfo.catin2.split(" ")[0]}*`,
};

type Guest = {
  id: string;
  name: string;
};

export const SebarUndangan = () => {
  const [formData, setFormData] = useState({
    nama: "Adilfi & Lukman",
    listNama: "",
    pilihan: "formal",
    textInvitation: templates.formal,
  });
  const [guests, setGuests] = useState<Guest[]>([]);

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const daftarNama = formData.listNama
      .split("\n")
      .map((n) => n.trim())
      .filter((n) => n !== "");

    const newGuests = daftarNama.map((name) => ({
      id: crypto.randomUUID(),
      name,
    }));

    setGuests(newGuests);
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
      alert("Fitur share tidak tersedia di browser ini");
    }
  };

  const handleCopy = async (guestName: string) => {
    const message = buildMessage(guestName);
    await navigator.clipboard.writeText(message);
    alert(`Teks undangan untuk ${guestName} berhasil disalin`);
  };

  const handleDelete = (id: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <>
      {/* Form Tamu */}
      <section className="w-full max-w-lg mx-auto p-4">
        <form onSubmit={handleSubmit}>
          {/* Nama Pengundang */}
          <div className="mb-5 text-[#6A6357]" style={{ fontFamily: '"Adamina", serif' }}>
            <label htmlFor="nama" className="block font-normal mb-1">
              Nama :
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
          <button
            type="submit"
            className="flex items-center justify-center gap-x-1 bg-[#fefced] border-2 mb-3 font-light text-lg uppercase border-[#BF9E50] rounded-full w-full py-1 text-[#6a6357] cursor-pointer hover:bg-[#FFEECE] hover:text-[#24364D] transition-colors duration-300"
            style={{
              fontFamily: '"Anaheim", sans-serif',
              fontOpticalSizing: "auto",
            }}
          >
            Buat Daftar Nama
          </button>
        </form>
      </section>

      <br />
      <br />

      {/* List tamu */}
      <div className="h-full max-h-[60vh] overflow-y-auto w-full max-w-lg mx-auto relative">
        <table className="table w-full">
          <thead className="sticky w-full top-0">
            <tr>
              <th className="text-start bg-amber-50 p-3 rounded-s-lg border-e w-full">Nama Tamu</th>
              <th className="text-start bg-amber-50 p-3 rounded-e-lg">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {guests.length === 0 ? (
              <tr>
                <td colSpan={2} className="p-3 text-center text-gray-500">
                  Belum ada tamu
                </td>
              </tr>
            ) : (
              guests.map((guest) => (
                <tr key={guest.id}>
                  <td className="p-3 border-b border-[#fefced]">{guest.name}</td>
                  <td className="p-3 flex gap-x-1 items-center border-b border-[#fefced]">
                    <button onClick={() => handleWhatsapp(guest.name)} className="bg-emerald-400 rounded-full shadow-lg p-2 hover:bg-emerald-500 cursor-pointer transition-colors duration-300">
                      <Whatsapp size="24" color="#fff" />
                    </button>
                    <button onClick={() => handleShare(guest.name)} className="bg-[#fefced] rounded-full shadow-lg p-2 hover:bg-[#FFEECE] cursor-pointer transition-colors duration-300">
                      <Share2 size="20" color="#6a6357" />
                    </button>
                    <button onClick={() => handleCopy(guest.name)} className="bg-[#fefced] rounded-full shadow-lg p-2 hover:bg-[#FFEECE] cursor-pointer transition-colors duration-300">
                      <Copy size="24" color="#6a6357" />
                    </button>
                    <button onClick={() => handleDelete(guest.id)} className="bg-rose-300 rounded-full shadow-lg p-2 hover:bg-rose-400 cursor-pointer transition-colors duration-300">
                      <Trash size="24" color="#fff" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
