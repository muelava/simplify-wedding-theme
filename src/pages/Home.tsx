import { useRef, useState, useEffect } from "react";

const Home = () => {
  const coverRef = useRef<HTMLDivElement>(null);
  const blankBackground = useRef<HTMLDivElement>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Simulasi loading, kemudian tampilkan cover
    const loadingTimer = setTimeout(() => {
      setShowLoader(false);
      // Delay sedikit sebelum animasi cover dimulai
      setTimeout(() => {
        setIsLoaded(true);
      }, 200);
    }, 1500); // Loader tampil 1.5 detik

    return () => clearTimeout(loadingTimer);
  }, []);

  const handleOpenClick = () => {
    setIsOpening(true);
    if (coverRef.current) {
      blankBackground.current?.remove();

      // Menambahkan class untuk animasi fade out
      coverRef.current.style.transition = "opacity 0.8s ease-in-out, transform 0.8s ease-in-out";
      coverRef.current.style.opacity = "0";
      coverRef.current.style.transform = "scale(1.05)";

      // Setelah animasi selesai, sembunyikan element
      setTimeout(() => {
        if (coverRef.current) {
          coverRef.current.classList.add("hidden");
        }
      }, 800);
    }
  };

  return (
    <>
      <section className={`w-full max-w-lg mx-auto relative transition-all duration-300 ${showLoader ? "bg-white" : "bg-transparent"}`}>
        {/* ============ LOADER ============ */}
        {showLoader && (
          <div className="fixed inset-0 z-50 bg-orange-50 flex flex-col justify-center items-center">
            <div className="text-center">
              <p className="text-[#6A6357] text-xl mb-4" style={{ fontFamily: "'Adamina', sans-serif" }}>
                Memuat...
              </p>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-[#6A6357] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#6A6357] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-[#6A6357] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}

        {/* ============ NAVIGATION ============ */}
        <div className="fixed flex flex-col gap-y-5 justify-center items-center h-screen z-40" style={{ right: "calc(50% - 310px)" }}>
          <a href="#">
            <img src="/icons/1.svg" alt="icon-1" className="size-10" />
          </a>
          <a href="#">
            <img src="/icons/2.svg" alt="icon-2" className="size-10" />
          </a>
          <a href="#">
            <img src="/icons/3.svg" alt="icon-3" className="size-10" />
          </a>
          <a href="#">
            <img src="/icons/4.svg" alt="icon-4" className="size-10" />
          </a>
          <a href="#">
            <img src="/icons/5.svg" alt="icon-5" className="size-10" />
          </a>
        </div>

        {/* ============ COVER ============ */}
        <div
          ref={coverRef}
          className={`fixed inset-0 pt-14 pb-3 md:pb-16 z-50 overflow-y-auto transition-all duration-1000 ease-out ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
          style={{
            backgroundImage: "url(/images/background-cover.jpeg)",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="bg-gradient-to-b from-orange-50/5 to-orange-50 absolute opacity-100 -z-10 left-0 top-0 bottom-0 right-0" />
          <div className={`flex flex-col justify-between min-h-full z-20 transition-all duration-1200 delay-300 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="uppercase text-2xl tracking-[17px] text-center text-[#6A6357]" style={{ fontFamily: '"Alika Misely", sans-serif' }}>
              Undangan
            </p>
            <div className="py-10">
              <p className="text-[#6A6357] text-center" style={{ fontFamily: "'Adamina', sans-serif" }}>
                You are invited to our wedding
              </p>
              <p className="text-[#6A6357] text-center text-5xl mt-3 mb-10" style={{ fontFamily: "'Alika Misely', georgia", fontFeatureSettings: '"ordn" on, "ss07" on' }}>
                Adilfi & Lukman
              </p>

              <div className="p-1 w-full max-w-[200px] md:max-w-[220px] mx-auto rounded-sm group">
                <button className="bg-transparent px-1 mx-auto rounded-sm flex items-center w-full border border-[#6A6357] hover:border-[#BF9E50] hover:bg-[#F2ECD9] transition-all duration-150 cursor-pointer" onClick={handleOpenClick} disabled={isOpening}>
                  <img src="/images/unlock.png" className="size-10" />
                  <span className="h-12 md:h-14 w-[0.8px] mx-1 bg-[#6A6357] inline-block group-hover:bg-[#BF9E50]" />
                  <span className="uppercase text-[#6A6357] text-center flex-auto text-sm md:text-base">Buka Undangan</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* blank background */}
        <div ref={blankBackground} className="z-40 bg-orange-50 w-full h-screen fixed top-0 bottom-0 right-0 left-0"></div>

        {/* ============ HERO ============ */}
        <div className={`h-screen bg-[#EEEAE5] p-3 transition-opacity duration-300 ${showLoader ? "opacity-0" : "opacity-100"}`}>
          <div className="border border-dashed w-full rounded-xl h-full md:max-h-[800px] flex flex-col pt-8 md:pt-0 md:justify-center">
            <div className="relative h-4/5">
              <p className="text-[#6A6357] text-center text-lg mb-5" style={{ fontFamily: "'Adamina', sans-serif" }}>
                We are getting married
              </p>
              <p className="text-[#6A6357] text-center text-[40px] md:text-5xl mt-3 mb-10" style={{ fontFamily: "'Alika Misely', georgia", fontFeatureSettings: '"ordn" on, "ss07" on' }}>
                Adilfi & Lukman
              </p>

              <div>
                <img src="/images/divider-1.png" alt="divider-1.png" className="w-36 mx-auto" />
                <p className="text-[#6A6357] text-center text-lg my-3" style={{ fontFamily: "'Adamina', sans-serif" }}>
                  Sabtu, 2 April 2022
                </p>
                <img src="/images/divider-1.png" alt="divider-1.png" className="w-36 mx-auto rotate-180" />
              </div>

              <div
                className="h-[310px] absolute md:bottom-[50px] left-0 mt-10 md:mt-0"
                style={{
                  width: "calc(100% + 5px)",
                  background: `
                url(/images/cover-1.png) no-repeat top 30px left,
                url(/images/cover-2.png) no-repeat bottom 23px left 6px,
                url(/images/cover-3.png) no-repeat top -33px right -5px,
                url(/images/cover-4.png) no-repeat bottom 12px right 8px,
                url(/images/cover-5.png) no-repeat top left 100px
                `,
                  backgroundSize: "190.86px, 132.71px, 261.03px, 132.71px, 53.4px",
                }}
              >
                <div
                  className="w-[300px] h-[144px] rounded-[30px] mt-[120px] ms-[50%] flex flex-col justify-center items-center translate-x-[-50%] relative"
                  style={{
                    background: `
                url(/images/cd-bg-2.png) no-repeat center,
                url(/images/cd-bg-1.png) no-repeat center
                `,
                    backgroundSize: "calc(100% - 17px), 100%",
                  }}
                >
                  <div>
                    <p className="text-[37px] text-[#6A6357]" style={{ fontFamily: "'Vintage Signature', cursive" }}>
                      Save the Date
                    </p>
                    <div className="text-[#6A6357] flex gap-x-3" style={{ fontFamily: "'Alika Misely', georgia" }}>
                      <span className="flex flex-col items-center">
                        <span className="text-[27px]">04</span>
                        <small className="text-base">Hari</small>
                      </span>
                      <span className="w-2 text-center self-center">:</span>
                      <span className="flex flex-col items-center">
                        <span className="text-[27px]">03</span>
                        <small className="text-base">Jam</small>
                      </span>
                      <span className="w-2 text-center self-center">:</span>
                      <span className="flex flex-col items-center">
                        <span className="text-[27px]">02</span>
                        <small className="text-base">Menit</small>
                      </span>
                      <span className="w-2 text-center self-center">:</span>
                      <span className="flex flex-col items-center">
                        <span className="text-[27px]">01</span>
                        <small className="text-base">Detik</small>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
