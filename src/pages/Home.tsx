import Aos from "aos";
import "./Home.css";
import "aos/dist/aos.css";
import { useRef, useState, useEffect } from "react";
import "animate.css";
import { CalendarDays, MapPinned, Plus } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import WheelGesturesPlugin from "embla-carousel-wheel-gestures";

const galleriesData: string[] = ["/images/background-cover.jpeg", "/images/background-cover.jpeg", "/images/background-cover.jpeg", "/images/background-cover.jpeg", "/images/background-cover.jpeg", "/images/background-cover.jpeg", "/images/background-cover.jpeg", "/images/background-cover.jpeg", "/images/background-cover.jpeg"];

const Home = () => {
  Aos.init();
  const coverRef = useRef<HTMLDivElement>(null);
  const blankBackground = useRef<HTMLDivElement>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [showNavigation, setShowNavigation] = useState(false);
  const isTablet = window.innerWidth >= 768;
  const [emblaRef] = useEmblaCarousel({ dragFree: true, containScroll: "trimSnaps" }, [WheelGesturesPlugin()]);

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
      coverRef.current.style.transition = "opacity 1s ease-in-out, transform 1s ease-in-out";
      coverRef.current.style.opacity = "0";
      coverRef.current.style.transform = "scale(1.05)";

      // Setelah animasi selesai, sembunyikan element
      setTimeout(() => {
        if (coverRef.current) {
          coverRef.current.classList.add("hidden");
          setShowNavigation(true);
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
              <p className="text-[#6A6357] text-5xl mb-8 animate__animated animate__bounceOut animate__slow" style={{ fontFamily: "'Alika Misely', georgia", fontFeatureSettings: '"ordn" on, "ss07" on' }}>
                A & L
              </p>
              <div className="flex justify-center space-x-3 mx-auto">
                <div className="w-2 h-2 bg-[#6A6357] rounded-full animate-ping"></div>
                <div className="w-2 h-2 bg-[#6A6357] rounded-full animate-ping" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-[#6A6357] rounded-full animate-ping" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}

        {/* ============ NAVIGATION ============ */}
        {showNavigation && (
          <div className="fixed w-full md:w-auto flex flex-row md:flex-col gap-x-3 gap-y-5 justify-center items-center h-10 md:h-screen z-40 animate__animated animate__bounceInUp animate__slower bottom-8 md:bottom-auto md:right-[calc(50%-310px)]">
            <a href="#" className="transform hover:scale-105 transition-transform duration-300" data-aos={isTablet && "fade-up"} data-aos-delay="600" data-aos-duration="2000">
              <img src="/icons/1.svg" alt="icon-1" className="size-12 md:size-10" />
            </a>
            <a href="#" className="transform hover:scale-105 transition-transform duration-300" data-aos={isTablet && "fade-up"} data-aos-delay="900" data-aos-duration="2000">
              <img src="/icons/2.svg" alt="icon-2" className="size-12 md:size-10" />
            </a>
            <a href="#" className="transform hover:scale-105 transition-transform duration-300" data-aos={isTablet && "fade-up"} data-aos-delay="1200" data-aos-duration="2000">
              <img src="/icons/3.svg" alt="icon-3" className="size-12 md:size-10" />
            </a>
            <a href="#" className="transform hover:scale-105 transition-transform duration-300" data-aos={isTablet && "fade-up"} data-aos-delay="1500" data-aos-duration="2000">
              <img src="/icons/4.svg" alt="icon-4" className="size-12 md:size-10" />
            </a>
            <a href="#" className="transform hover:scale-105 transition-transform duration-300" data-aos={isTablet && "fade-up"} data-aos-delay="1800" data-aos-duration="2000">
              <img src="/icons/5.svg" alt="icon-5" className="size-12 md:size-10" />
            </a>
          </div>
        )}

        {/* ============ PLAY & PAUSE MUSIC BUTTON ============ */}
        <div className="fixed flex flex-col gap-y-5 justify-center items-center z-40 right-[5%] bottom-24 md:right-[calc(50%-310px)] md:bottom-[calc(30%-200px)]">
          <div className="rounded-full flex items-center justify-center cursor-pointer size-[45px] relative opacity-70 bg-[#666765]/80" style={{ backgroundImage: "url('/images/icon-play.png')", backgroundSize: "30px", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
            <div className="size-3/4 bg-[#666765]/50 opacity-100 rounded-full animate-ping animate__animated animate__slower"></div>
          </div>
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
                <button
                  className="bg-transparent px-1 mx-auto rounded-sm flex items-center w-full border border-[#6A6357] hover:border-[#BF9E50] hover:bg-[#F2ECD9] transition-all duration-150 cursor-pointer"
                  onClick={() => {
                    handleOpenClick();
                  }}
                  disabled={isOpening}
                >
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
        <div className={`h-screen md:h-[90vh] bg-[#EEEAE5] p-3 transition-opacity duration-300 ${showLoader ? "opacity-0" : "opacity-100"}`}>
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
                    <p className="text-[37px] text-[#6A6357] text-center" style={{ fontFamily: "VintageSignature, cursive" }}>
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

        {/* ============ BRIDE GROOM ============ */}
        <div className="bg-[#EEEAE5] p-3 overflow-hidden">
          <p data-aos="fade-up" data-aos-delay="100" data-aos-duration="1500" className="text-[#6A6357] text-center text-[40px] md:text-5xl mt-3 mb-10" style={{ fontFamily: "'Alika Misely', Georgia", fontFeatureSettings: '"ordn" on, "ss07" on' }}>
            Mempelai
          </p>
          <p data-aos="fade-up" data-aos-delay="200" data-aos-duration="1500" className="text-[#6A6357] text-center text-lg font-normal mb-5 max-w-sm mx-auto" style={{ fontFamily: "'Adamina', sans-serif" }}>
            Happy marriages begin when we marry the ones we love, and they blossom when we love the ones we marry.
          </p>

          <div className="relative flex justify-center h-[300px]">
            <img src="/images/butter-fly-bride.png" alt="butter-fly-bride.png" className="size-12 absolute top-3 right-1/4 md:right-1/3" />
            <div className="relative size-48">
              <div className="relative size-48 overflow-visible flex items-center justify-center">
                <img src="/images/groom.png" alt="groom.png" className="w-[80%] rounded-full" />
                <img src="/images/frame-photo.png" alt="frame-photo.png" className="w-[400px] h-[400px] rounded-full absolute object-scale-down" />
              </div>
            </div>
            <div className="relative size-48 top-20 right-10">
              <div className="relative size-48 overflow-visible flex items-center justify-center">
                <img src="/images/bride.png" alt="bride.png" className="w-[80%] rounded-full" />
                <img src="/images/frame-photo.png" alt="frame-photo.png" className="w-[400px] h-[400px] rounded-full absolute object-scale-down -rotate-45" />
              </div>
            </div>
            <p data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" style={{ fontFamily: "'Million Dreams', sans-serif" }} className="absolute text-4xl md:text-5xl bottom-16 md:bottom-14 left-1/4 text-[#6A6357]">
              &
            </p>
          </div>

          <div data-aos="fade-up" data-aos-delay="100" data-aos-duration="1500">
            <p className="text-[#6A6357] text-center text-3xl font-normal max-w-sm mx-auto" style={{ fontFamily: "'Alika Misely', Georgia" }}>
              Dr. Andy Fernando
            </p>
            <p className="text-[#6A6357] text-center text-3xl my-3" style={{ fontFamily: "VintageSignature, cursive" }}>
              Putra Dari
            </p>
            <p className="text-[#6A6357] text-center text-xl font-normal max-w-sm mx-auto" style={{ fontFamily: '"Adamina", serif' }}>
              Ayah Ucok Fernando
            </p>
            <p className="text-[#6A6357] text-center text-xl font-normal mb-5 max-w-sm mx-auto" style={{ fontFamily: '"Adamina", serif' }}>
              Ibu Ucok Fernando
            </p>
            <p className="text-[#6A6357] text-center text-xl font-normal mb-5 max-w-sm mx-auto" style={{ fontFamily: '"Adamina", serif' }}>
              Jakarta Selatan
            </p>
          </div>
          <br />
          <div data-aos="fade-up" data-aos-delay="100" data-aos-duration="1500">
            <p className="text-[#6A6357] text-center text-3xl font-normal max-w-sm mx-auto" style={{ fontFamily: "'Alika Misely', Georgia" }}>
              Melinda Fransiska, SH., MH.
            </p>
            <p className="text-[#6A6357] text-center text-3xl my-3" style={{ fontFamily: "VintageSignature, cursive" }}>
              Putri dari
            </p>
            <p className="text-[#6A6357] text-center text-xl font-normal max-w-sm mx-auto" style={{ fontFamily: '"Adamina", serif' }}>
              Ayah Melinda Fransiska
            </p>
            <p className="text-[#6A6357] text-center text-xl font-normal mb-5 max-w-sm mx-auto" style={{ fontFamily: '"Adamina", serif' }}>
              Ibu Melinda Fransiska
            </p>
            <p className="text-[#6A6357] text-center text-xl font-normal mb-5 max-w-sm mx-auto" style={{ fontFamily: '"Adamina", serif' }}>
              Jakarta Selatan
            </p>
          </div>
        </div>

        {/* ============ EVENT ============ */}
        <div className="bg-[#EEEAE5] pt-20 pb-3 overflow-visible">
          <div className="relative overflow-visible">
            <img src="/images/event-flower.png" alt="event-flower.png" className="size-12 md:size-14 absolute -top-9 right-[24%]" />
            <p className="text-[#BF9E4E] text-center text-[56px] md:text-[78px] mt-3 leading-[0.5]" style={{ fontFamily: "VintageSignature, cursive" }}>
              Detail
            </p>
            <p className="text-[#6A6357] tracking-[0.73rem] text-center text-lg" style={{ fontFamily: "'Adamina', sans-serif" }}>
              ACARA
            </p>
          </div>

          {/* Contract */}
          <div className="w-full max-w-xs mx-auto bg-[#F4F1EA] rounded-xl p-3 mb-4 shadow">
            <div className="border border-dashed rounded-xl">
              <p className="text-[#6A6357] text-center text-[34px] md:text-4xl py-3 font-normal max-w-sm mx-auto" style={{ fontFamily: "'Alika Misely', Georgia" }}>
                Akad Nikah
              </p>
              <p style={{ fontFamily: "'Adamina', sans-serif" }} className="tracking-[0.165rem] uppercase text-center text-base md:text-[18px] text-[#6A6357]">
                Gedung Acara 1
              </p>
              <p style={{ fontFamily: "'Adamina', sans-serif" }} className="tracking-[0.065rem] text-center text-base text-[#6A6357]">
                Jalan Gedung Acara 1
              </p>
              <p style={{ fontFamily: "'Adamina', sans-serif" }} className="tracking-[0.065rem] text-center text-base text-[#6A6357] mb-2 mt-3">
                Sabtu, 9 April 2022
              </p>
              <p style={{ fontFamily: "'Adamina', sans-serif" }} className="tracking-[0.065rem] text-center text-base text-[#6A6357] leading-1 mb-3">
                12:00 - 13:00 WIB
              </p>
              <div className="w-full max-w-[220px] mx-auto my-8">
                <button className="flex items-center justify-center gap-x-1 bg-[#fefced] border-2 mb-2 font-light text-lg uppercase border-[#BF9E50] rounded-full w-full py-1 text-[#6a6357] cursor-pointer" style={{ fontFamily: '"Anaheim", sans-serif', fontOpticalSizing: "auto" }}>
                  <Plus size={14} /> Kalender <CalendarDays size={16} className="align-middle" />
                </button>
                <button className="flex items-center justify-center gap-x-1 bg-[#fefced] border-2 font-light text-lg uppercase border-[#BF9E50] rounded-full w-full py-1 text-[#6a6357] cursor-pointer" style={{ fontFamily: '"Anaheim", sans-serif', fontOpticalSizing: "auto" }}>
                  <MapPinned size={18} className="opacity-60" /> Buka Map
                </button>
              </div>
            </div>
          </div>

          {/* Reception */}
          <div className="w-full max-w-xs mx-auto bg-[#F4F1EA] rounded-xl p-3 shadow">
            <div className="border border-dashed rounded-xl py-3">
              <p className="text-[#6A6357] text-center text-[34px] md:text-4xl pb-3 font-normal max-w-sm mx-auto" style={{ fontFamily: "'Alika Misely', Georgia" }}>
                Resepsi
              </p>
              <p style={{ fontFamily: "'Adamina', sans-serif" }} className="tracking-[0.165rem] uppercase text-center text-base md:text-[18px] text-[#6A6357]">
                Gedung Acara 2
              </p>
              <p style={{ fontFamily: "'Adamina', sans-serif" }} className="tracking-[0.065rem] text-center text-base text-[#6A6357]">
                Jalan Gedung Acara 2
              </p>
              <p style={{ fontFamily: "'Adamina', sans-serif" }} className="tracking-[0.065rem] text-center text-base text-[#6A6357] mb-2 mt-3">
                Sabtu, 9 April 2022
              </p>
              <p style={{ fontFamily: "'Adamina', sans-serif" }} className="tracking-[0.065rem] text-center text-base text-[#6A6357] leading-1 mb-3">
                19:00 - 22:00 WIB
              </p>
            </div>
          </div>
        </div>

        {/* ============ LOVE STORY ============ */}
        <div className="bg-[#EEEAE5] px-3 py-16">
          <div className="relative py-16">
            <img src="/images/butter-fly-bride.png" alt="butter-fly-bride.png" className="size-13 absolute top-10 right-[20%] md:right-1/4" />
            <div className="w-full max-w-[280px] md:max-w-xs mx-auto relative">
              <p style={{ fontFamily: "'Alika Misely', Georgia", fontFeatureSettings: '"ss04" on' }} className="uppercase text-2xl md:text-3xl tracking-[0.24rem] text-[#6A6357] mb-2 md:mb-3">
                Our Love
              </p>
              <img src="/images/divider-1.png" alt="divider-1.png" className="w-[125px] md:w-36 rotate-180" />
              <p style={{ fontFamily: "'Alika Misely', Georgia", fontFeatureSettings: '"ss04" on' }} className="absolute top-[calc(50%-6px)] text-[44px] md:text-[54px] right-[calc(50%-100px)] md:right-[calc(50%-125px)] tracking-[0.24rem] text-[#6A6357] mb-3">
                Story
              </p>
            </div>
          </div>

          {/* Love Story Journey */}
          <div className="embla" ref={emblaRef}>
            <div className="embla__container gap-x-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="embla__slide w-full max-w-xs mx-auto bg-[#F4F1EA] rounded-xl p-3 shadow select-none cursor-grab active:cursor-grabbing">
                  <div className="border border-dashed rounded-xl py-3">
                    <p className="text-[#6A6357] text-center text-[22px] font-normal max-w-sm mx-auto uppercase" style={{ fontFamily: "'Adamina', serif" }}>
                      Kenalan
                    </p>
                    <p style={{ fontFamily: "'Adamina', sans-serif" }} className="text-center text-lg text-[#BF9E4E] mb-2">
                      Kampus, 2015
                    </p>
                    <hr className="border-dashed border-[#BF9E4E]" />
                    <p className="text-xs p-3 text-[#605921] leading-normal" style={{ fontFamily: "'Adamina', serif" }}>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit aliquid, alias dolorum porro quia assumenda error officiis totam sapiente odit?{" "}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============ PHOTO GALLERY ============ */}
        <div className="bg-[#EEEAE5] p-5 overflow-hidden">
          <p data-aos="fade-up" data-aos-delay="100" data-aos-duration="1500" className="text-[#6A6357] text-center text-[40px] md:text-5xl mt-3 mb-10" style={{ fontFamily: "VintageSignature, cursive" }}>
            Photo Gallery
          </p>

          <div className="grid grid-cols-3 gap-2 p-2 bg-[#f4f1ea]">
            {galleriesData.map((item: string, index) => (
              <img key={index} src={item} alt="background-cover.jpeg" className="object-cover aspect-square rounded cursor-pointer" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
