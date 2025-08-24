import { Copy, Whatsapp } from "iconsax-react";
import { Share2, Trash } from "lucide-react";

export const SebarUndangan = () => {
  return (
    <>
      <section className="w-full max-w-lg mx-auto p-4">
        <form>
          {/* Nama Pengundang */}
          <div style={{ fontFamily: '"Adamina", serif' }} className="text-[#6A6357] mb-5">
            <label htmlFor="nama" className="block font-normal mb-1">
              Nama :
            </label>
            <input type="text" id="nama" placeholder="Nama" className="border border-[#AA9B13] bg-white w-full p-2 rounded" />
          </div>

          {/* List Nama Undangan */}
          <div style={{ fontFamily: '"Adamina", serif' }} className="text-[#6A6357] mb-5">
            <label htmlFor="list-name" className="block font-normal mb-1">
              List Nama Undangan <br />
              <small className="text-xs italic">*Gunakan baris baru (↵) untuk memisahkan nama yang akan diundang.</small>
            </label>
            <textarea id="list-name" className="border border-[#AA9B13] bg-white w-full p-2 rounded min-h-30 field-sizing-content" placeholder="Denis ↵"></textarea>
          </div>

          {/* Pilihan Text */}
          <div style={{ fontFamily: '"Adamina", serif' }} className="text-[#6A6357] flex gap-x-3 mb-3">
            <div className="flex gap-x-1.5">
              <input type="radio" id="formal" name="pilihan" className="peer/formal" />
              <label htmlFor="formal" className="text-[#AA9B13] peer-checked/formal:text-[#6A6357]">
                Formal
              </label>
            </div>
            <div className="flex gap-x-1.5">
              <input type="radio" id="muslim" name="pilihan" className="peer/muslim" />
              <label htmlFor="muslim" className="text-[#AA9B13] peer-checked/muslim:text-[#6A6357]">
                Muslim
              </label>
            </div>
          </div>

          <div style={{ fontFamily: '"Adamina", serif' }} className="text-[#6A6357]">
            <label htmlFor="text-invitation" className="block font-normal mb-1">
              Isi Teks Pengantar
            </label>
            <textarea id="text-invitation" className="border border-[#AA9B13] bg-white w-full p-2 rounded min-h-30 field-sizing-content" placeholder="Isi Text Pengantar">
              Kepada Yth. Bapak/Ibu/Saudara/i *[nama]*
            </textarea>
          </div>
          <button type="button" className="flex items-center justify-center gap-x-1 bg-[#fefced] border-2 mb-3 font-light text-lg uppercase border-[#BF9E50] rounded-full w-full py-1 text-[#6a6357] cursor-pointer hover:bg-[#FFEECE] hover:text-[#24364D] transition-colors duration-300" style={{ fontFamily: '"Anaheim", sans-serif', fontOpticalSizing: "auto" }}>
            Buat Daftar Nama
          </button>
        </form>
      </section>
      <br />
      <br />
      <div className="h-full max-h-[60vh] overflow-y-auto w-full max-w-lg mx-auto relative">
        <table className="table w-full">
          <thead className="sticky w-full top-0">
            <tr>
              <th className="text-start bg-amber-50 p-3 rounded-s-lg border-e w-full">Nama Tamu</th>
              <th className="text-start bg-amber-50 p-3 rounded-e-lg">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 15 }).map((_, index) => (
              <tr key={index}>
                <td className="p-3 border-b border-[#fefced]">Denis</td>
                <td className="p-3 flex gap-x-1 items-center border-b border-[#fefced]">
                  <button className="bg-emerald-400 rounded-full shadow-lg p-2 hover:bg-emerald-500 cursor-pointer transition-colors duration-300">
                    <Whatsapp size="24" color="#fff" />
                  </button>
                  <button className="bg-[#fefced] rounded-full shadow-lg p-2 hover:bg-[#FFEECE] cursor-pointer transition-colors duration-300">
                    <Share2 size="20" color="#6a6357" />
                  </button>
                  <button className="bg-[#fefced] rounded-full shadow-lg p-2 hover:bg-[#FFEECE] cursor-pointer transition-colors duration-300">
                    <Copy size="24" color="#6a6357" />
                  </button>
                  <button className="bg-rose-300 rounded-full shadow-lg p-2 hover:bg-rose-400 cursor-pointer transition-colors duration-300">
                    <Trash size="24" color="#fff" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
