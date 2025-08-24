import Aos from "aos";
import "./Home.css";
import "aos/dist/aos.css";
import { useRef, useState, useEffect } from "react";
import "animate.css";
import { CalendarDays, Copy, Gift, MailOpen, MailSearch, MapPinned, Pause, Play, Plus } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import WheelGesturesPlugin from "embla-carousel-wheel-gestures";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { WeddingCountdown } from "../components/WeddingCountdown";
import { format, formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import saveDate from "../utils/saveDate";
import Dialog from "../components/Dialog";
import toast from "react-hot-toast";
import { listenGreetings, submitGreeting, type GreetingData } from "../lib/greetings";

const titleWedding = "Wedding Adilfi & Lukman";
const weddingLocation = "https://maps.app.goo.gl/yTBKjbF9HQUyfwAz8?g_st=aw";

const galleriesData: string[] = ["/images/background-cover.jpeg", "/images/background-cover.jpeg", "/images/background-cover.jpeg", "/images/background-cover.jpeg", "/images/background-cover.jpeg", "/images/background-cover.jpeg", "/images/background-cover.jpeg", "/images/background-cover.jpeg", "/images/background-cover.jpeg"];

const groomSideFamilies: string[] = ["Kel. Bapak Ahmad Fadhil", "Kel. Bapak Rizky Ananta", "Kel. Ibu Maya Putri", "Kel. Bapak Damar Wicaksono", "Kel. Jonathan Lee", "Kel. Emily Carter", "Kel. William Brown", "Kel. Besar Sarah Thompson", "Kel. Besar Daniel Evans / Maria"];

const brideSideFamilies: string[] = ["Kel. Bapak Suryo Nugroho", "Kel. Bapak Andrian Saputra", "Kel. Ibu Lestari Widya", "Kel. Bapak Haris Gunawan", "Kel. Michael Johnson", "Kel. Olivia White", "Kel. James Anderson", "Kel. Besar Isabella Martinez", "Kel. Besar Sophia Taylor / George"];

const weddingDate = "2025-09-14T11:30:00";

const bankAccounts = [
  {
    bank: "Bank MANDIRI",
    name: "Adilfi Wicaksani",
    number: "1770018344934",
  },
  {
    bank: "Bank BCA",
    name: "Lukman Muhamad Ismail",
    number: "3460218178",
  },
];

const loveStories = [
  { title: "Takdir Pertemuan", subtitle: "Awal Mula", desc: "Benar kata mereka, takdir memang menjadi alasan pertemuan. Seperti pecahan kaca saling merangkai, menembus sekat hingga dekat." },
  { title: "Menuju Keyakinan", subtitle: "Perjalanan Hati", desc: "Ragu pernah menjadi bayang, tapi keteduhan dan sandaran adalah penolong dalam genggaman." },
  { title: "Langkah Bersama", subtitle: "Menuju Masa Depan", desc: "Kini kami adalah tuan dan puan dengan sisi ego dan kosong yang bertapak di atas permulaan menuju tujuan. Bersama kami berlayar." },
];

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
  const [open, setOpen] = useState(false);
  const [indexImage, setIndexImage] = useState(0);
  const [activeSection, setActiveSection] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [guestName, setGuestName] = useState("");

  const [greetings, setGreetings] = useState<GreetingData[]>([]);

  useEffect(() => {
    const unsubscribe = listenGreetings((data) => {
      setGreetings(data);
    });

    return () => {
      // stop listening ketika unmount
      unsubscribe();
    };
  }, []);

  // greetings form state
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Refs untuk setiap section
  const brideGroomRef = useRef(null);
  const eventsRef = useRef(null);
  const loveStoryRef = useRef(null);
  const galleryRef = useRef(null);
  const greetingsRef = useRef(null);

  const scrollToSectionAlt = (ref: { current: HTMLDivElement | null }) => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

  useEffect(() => {
    // Ketika cover masih ditampilkan, disable scroll
    if (!isOpening) {
      // Disable scroll di body
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.height = "100%";

      document.body.classList.add("no-scroll");
    } else {
      // Enable scroll kembali ketika cover sudah dibuka
      document.body.style.overflow = "auto";
      document.body.style.position = "static";
      document.body.style.width = "auto";
      document.body.style.height = "auto";

      document.body.classList.remove("no-scroll");
    }

    // Cleanup function untuk reset style ketika component unmount
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.position = "static";
      document.body.style.width = "auto";
      document.body.style.height = "auto";

      document.body.classList.remove("no-scroll");
    };
  }, [isOpening]);

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

  useEffect(() => {
    // Definisikan tipe untuk section - sesuaikan dengan tipe ref yang sudah ada
    type SectionRef = {
      ref: React.RefObject<HTMLDivElement | null>;
      id: string;
    };

    const sections: SectionRef[] = [
      { ref: brideGroomRef, id: "brideGroom" },
      { ref: eventsRef, id: "events" },
      { ref: loveStoryRef, id: "loveStory" },
      { ref: galleryRef, id: "gallery" },
      { ref: greetingsRef, id: "greetings" },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute("data-section");
            if (sectionId) {
              setActiveSection(sectionId);
            }
          }
        });
      },
      {
        threshold: 0.3, // Section dianggap aktif jika 30% terlihat
        rootMargin: "-20% 0px -20% 0px", // Margin untuk lebih akurat
      }
    );

    sections.forEach(({ ref, id }: SectionRef) => {
      if (ref.current) {
        ref.current.setAttribute("data-section", id);
        observer.observe(ref.current);
      }
    });

    return () => {
      sections.forEach(({ ref }: SectionRef) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [showNavigation]);

  // Function untuk check apakah button aktif
  const isButtonActive = (sectionId: string): boolean => {
    return activeSection === sectionId;
  };

  // Music Player Functions
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
          toast.error("Tidak dapat memutar musik");
        });
        setIsPlaying(true);
      }
    }
  };

  const handleOpenClick = () => {
    setIsOpening(true);
    if (coverRef.current) {
      blankBackground.current?.remove();

      // Start playing music when invitation is opened
      if (audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.error("Error auto-playing audio:", error);
        });
        setIsPlaying(true);
      }

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

  const handleCopy = (text: string, notif?: string) => {
    navigator.clipboard.writeText(text);
    toast.success(<span>Nomor rekening {notif ? <b>{notif}</b> : null} berhasil disalin!</span>);
  };

  // Get guest name from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const toParam = urlParams.get("to");

    if (toParam) {
      // Decode URL dan replace + dengan spasi
      const decodedName = decodeURIComponent(toParam.replace(/\+/g, " "));
      setGuestName(decodedName);
      setName(decodedName);
    }
  }, []);

  // greetings form submit
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name || !message) {
      toast.error("Harap isi nama dan ucapan dulu 🙏");
      return;
    }

    setLoading(true);
    const res = await submitGreeting({ name, message });
    setLoading(false);

    if (res.success) {
      toast.success("Ucapan berhasil dikirim 🎉");
      setName("");
      setMessage("");
    } else {
      toast.error("Gagal mengirim ucapan 😢");
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/terbuang-dalam-waktu.mp3" // Ganti dengan path musik Anda
        loop
        preload="auto"
      />

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
            <button onClick={() => scrollToSectionAlt(brideGroomRef)} className={`transform cursor-pointer hover:scale-105 transition-transform duration-300 ${isButtonActive("brideGroom") ? "scale-105" : "scale-100"}`} data-aos={isTablet && "fade-up"} data-aos-delay="600" data-aos-duration="2000">
              <img src="/icons/1.svg" alt="icon-1" className="size-12 md:size-10" />
            </button>
            <button onClick={() => scrollToSectionAlt(eventsRef)} className={`transform cursor-pointer hover:scale-105 transition-transform duration-300 ${isButtonActive("events") ? "scale-105" : "scale-100"}`} data-aos={isTablet && "fade-up"} data-aos-delay="900" data-aos-duration="2000">
              <img src="/icons/2.svg" alt="icon-2" className="size-12 md:size-10" />
            </button>
            <button onClick={() => scrollToSectionAlt(loveStoryRef)} className={`transform cursor-pointer hover:scale-105 transition-transform duration-300 ${isButtonActive("loveStory") ? "scale-105" : "scale-100"}`} data-aos={isTablet && "fade-up"} data-aos-delay="1200" data-aos-duration="2000">
              <img src="/icons/3.svg" alt="icon-3" className="size-12 md:size-10" />
            </button>
            <button onClick={() => scrollToSectionAlt(galleryRef)} className={`transform cursor-pointer hover:scale-105 transition-transform duration-300 ${isButtonActive("gallery") ? "scale-105" : "scale-100"}`} data-aos={isTablet && "fade-up"} data-aos-delay="1500" data-aos-duration="2000" style={{ display: "none" }}>
              <img src="/icons/4.svg" alt="icon-4" className="size-12 md:size-10" />
            </button>
            <button onClick={() => scrollToSectionAlt(greetingsRef)} className={`transform cursor-pointer hover:scale-105 transition-transform duration-300 ${isButtonActive("greetings") ? "scale-105" : "scale-100"}`} data-aos={isTablet && "fade-up"} data-aos-delay="1500" data-aos-duration="2000">
              <img src="/icons/5.svg" alt="icon-5" className="size-12 md:size-10" />
            </button>
          </div>
        )}

        {/* ============ PLAY & PAUSE MUSIC BUTTON ============ */}
        {showNavigation && (
          <div className="fixed flex flex-col gap-y-5 justify-center items-center z-40 right-[5%] bottom-24 md:right-[calc(50%-310px)] md:bottom-[calc(30%-200px)]">
            <button
              onClick={toggleMusic}
              className={`rounded-full flex items-center justify-center cursor-pointer size-[45px] relative opacity-70 bg-[#666765]/80 hover:opacity-90 transition-all duration-300 ${isPlaying ? "animate-spin" : ""}`}
              style={{
                animation: isPlaying ? "spin 3s linear infinite" : "none",
              }}
            >
              <div className="size-3/4 bg-[#666765]/50 opacity-100 rounded-full animate-ping animate__animated animate__slower"></div>
              <div className="absolute inset-0 flex items-center justify-center">{isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white ml-1" />}</div>
            </button>
          </div>
        )}

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
              {guestName && (
                <p className="text-[#6A6357] text-center text-lg mt-2 mb-5" style={{ fontFamily: "'Adamina', sans-serif" }}>
                  <small>Kepada Yth.</small> <br />
                  <span className="font-bold uppercase">{guestName}</span>
                </p>
              )}
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
                  {format(new Date(weddingDate), "EEEE, dd MMMM yyyy", { locale: id })}
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
                  <WeddingCountdown targetDate={weddingDate} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============ BRIDE GROOM ============ */}
        <div ref={brideGroomRef} className="bg-[#EEEAE5] p-3 overflow-hidden">
          <p data-aos="fade-up" data-aos-delay="100" data-aos-duration="1500" className="text-[#6A6357] text-center text-[40px] md:text-5xl mt-3 mb-10" style={{ fontFamily: "'Alika Misely', Georgia", fontFeatureSettings: '"ordn" on, "ss07" on' }}>
            Mempelai
          </p>
          <p data-aos="fade-up" data-aos-delay="200" data-aos-duration="1500" className="text-[#6A6357] text-center text-lg font-normal mb-5 max-w-sm mx-auto" style={{ fontFamily: "'Adamina', sans-serif" }}>
            Happy marriages begin when we marry the ones we love, and they blossom when we love the ones we marry.
          </p>

          <div className="relative flex justify-center h-[300px]">
            <img src="/images/butter-fly-bride.png" alt="butter-fly-bride.png" className="size-12 absolute top-3 right-1/4 md:right-1/3" />
            <div className="relative size-48" data-aos="fade-right" data-aos-delay="100" data-aos-duration="1500" data-aos-anchor-placement="top-bottom">
              <div className="relative size-48 overflow-visible flex items-center justify-center">
                <img src="/images/bride.png" alt="bride.png" className="w-[80%] rounded-full" />
                <img src="/images/frame-photo.png" alt="frame-photo.png" className="w-[400px] h-[400px] rounded-full absolute object-scale-down" />
              </div>
            </div>
            <div className="relative size-48 top-20 right-10" data-aos="fade-left" data-aos-delay="300" data-aos-duration="1500" data-aos-anchor-placement="top-bottom">
              <div className="relative size-48 overflow-visible flex items-center justify-center">
                <img src="/images/groom.png" alt="groom.png" className="w-[80%] rounded-full" />
                <img src="/images/frame-photo.png" alt="frame-photo.png" className="w-[400px] h-[400px] rounded-full absolute object-scale-down -rotate-45" />
              </div>
            </div>
            <p data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" style={{ fontFamily: "'Million Dreams', sans-serif" }} className="absolute text-4xl md:text-5xl bottom-16 md:bottom-14 left-1/4 text-[#6A6357]">
              &
            </p>
          </div>

          <div data-aos="fade-up" data-aos-delay="100" data-aos-duration="1500">
            <p className="text-[#6A6357] text-center text-3xl font-normal max-w-sm mx-auto" style={{ fontFamily: "'Alika Misely', Georgia" }}>
              Adilfi Wicaksani
            </p>
            <p className="text-[#6A6357] text-center text-3xl my-3" style={{ fontFamily: "VintageSignature, cursive" }}>
              Putri Dari
            </p>
            <p className="text-[#6A6357] text-center text-xl font-normal max-w-sm mx-auto" style={{ fontFamily: '"Adamina", serif' }}>
              Bapak Subiantoro
            </p>
            <p className="text-[#6A6357] text-center text-xl font-normal mb-5 max-w-sm mx-auto" style={{ fontFamily: '"Adamina", serif' }}>
              Ibu Hj. Dede Sukaesih
            </p>
            <p className="text-[#6A6357] text-center text-xl font-normal mb-5 max-w-sm mx-auto" style={{ fontFamily: '"Adamina", serif' }}>
              Garut
            </p>
          </div>
          <br />
          <div data-aos="fade-up" data-aos-delay="100" data-aos-duration="1500">
            <p className="text-[#6A6357] text-center text-3xl font-normal max-w-sm mx-auto" style={{ fontFamily: "'Alika Misely', Georgia" }}>
              Lukman Muhamad Ismail
            </p>
            <p className="text-[#6A6357] text-center text-3xl my-3" style={{ fontFamily: "VintageSignature, cursive" }}>
              Putra dari
            </p>
            <p className="text-[#6A6357] text-center text-xl font-normal max-w-sm mx-auto" style={{ fontFamily: '"Adamina", serif' }}>
              Bapak Alm. Suryana
            </p>
            <p className="text-[#6A6357] text-center text-xl font-normal mb-5 max-w-sm mx-auto" style={{ fontFamily: '"Adamina", serif' }}>
              Ibu Hj. M. Tati Mulyati
            </p>
            <p className="text-[#6A6357] text-center text-xl font-normal mb-5 max-w-sm mx-auto" style={{ fontFamily: '"Adamina", serif' }}>
              Purwakarta
            </p>
          </div>
        </div>

        {/* ============ EVENTS ============ */}
        <div ref={eventsRef} className="bg-[#EEEAE5] pt-20 pb-3 overflow-visible">
          <div className="relative overflow-visible mb-3">
            <img src="/images/event-flower.png" alt="event-flower.png" className="size-12 md:size-14 absolute -top-9 right-[24%]" />
            <p className="text-[#BF9E4E] text-center text-[56px] md:text-[78px] mt-3 leading-[0.5]" style={{ fontFamily: "VintageSignature, cursive" }} data-aos="fade-right" data-aos-duration="1500">
              Detail
            </p>
            <p className="text-[#6A6357] tracking-[0.73rem] text-center text-lg" style={{ fontFamily: "'Adamina', sans-serif" }} data-aos="fade-right" data-aos-delay="500" data-aos-duration="1500">
              ACARA
            </p>
          </div>

          {/* Contract */}
          <div className="w-full max-w-xs mx-auto bg-[#F4F1EA] rounded-xl p-3 mb-4 shadow">
            <div className="border border-dashed rounded-xl">
              <p className="text-[#6A6357] text-center text-[34px] md:text-4xl py-3 font-normal max-w-sm mx-auto" style={{ fontFamily: "'Alika Misely', Georgia" }} data-aos="fade-up" data-aos-duration="1500">
                Akad & Resepsi
              </p>
              <p style={{ fontFamily: "'Adamina', sans-serif" }} className="tracking-[0.165rem] uppercase text-center text-base md:text-[18px] text-[#6A6357]" data-aos="fade-up" data-aos-duration="1500">
                Limbangan, Garut
              </p>
              <p style={{ fontFamily: "'Adamina', sans-serif" }} className="tracking-[0.065rem] text-center text-base text-[#6A6357]" data-aos="fade-up" data-aos-duration="1500">
                Kp. Loji, Limbangan Timur Limbangan, Garut (Belakang Pos Giro)
              </p>
              <p style={{ fontFamily: "'Adamina', sans-serif" }} className="tracking-[0.065rem] text-center text-base text-[#6A6357] mb-2 mt-3" data-aos="fade-up" data-aos-duration="1500">
                {format(new Date(weddingDate), "EEEE, dd MMMM yyyy", { locale: id })}
              </p>
              <p style={{ fontFamily: "'Adamina', sans-serif" }} className="tracking-[0.065rem] text-center text-base text-[#6A6357] leading-1 mb-3" data-aos="fade-up" data-aos-duration="1500">
                {/* 12:00 - 13:00 WIB */}
                {format(new Date(weddingDate), "HH:mm", { locale: id })} WIB - s.d Selesai
              </p>
              <div className="w-full max-w-[220px] mx-auto my-8" data-aos="fade-up" data-aos-duration="1500">
                <button onClick={() => saveDate(weddingDate, titleWedding)} className="flex items-center justify-center gap-x-1 bg-[#fefced] border-2 mb-2 font-light text-lg uppercase border-[#BF9E50] rounded-full w-full py-1 text-[#6a6357] cursor-pointer" style={{ fontFamily: '"Anaheim", sans-serif', fontOpticalSizing: "auto" }}>
                  <Plus size={14} /> Kalender <CalendarDays size={16} className="align-middle" />
                </button>
                <button onClick={() => window.open(weddingLocation, "_blank")} className="flex items-center justify-center gap-x-1 bg-[#fefced] border-2 font-light text-lg uppercase border-[#BF9E50] rounded-full w-full py-1 text-[#6a6357] cursor-pointer" style={{ fontFamily: '"Anaheim", sans-serif', fontOpticalSizing: "auto" }}>
                  <MapPinned size={18} className="opacity-60" /> Buka Map
                </button>
              </div>
            </div>
          </div>

          {/* Reception */}
          {/* <div className="w-full max-w-xs mx-auto bg-[#F4F1EA] rounded-xl p-3 shadow">
            <div className="border border-dashed rounded-xl py-3">
              <p className="text-[#6A6357] text-center text-[34px] md:text-4xl pb-3 font-normal max-w-sm mx-auto" style={{ fontFamily: "'Alika Misely', Georgia" }} data-aos="fade-up" data-aos-duration="1500">
                Resepsi
              </p>
              <p style={{ fontFamily: "'Adamina', sans-serif" }} className="tracking-[0.165rem] uppercase text-center text-base md:text-[18px] text-[#6A6357]" data-aos="fade-up" data-aos-duration="1500">
                Gedung Acara 2
              </p>
              <p style={{ fontFamily: "'Adamina', sans-serif" }} className="tracking-[0.065rem] text-center text-base text-[#6A6357]" data-aos="fade-up" data-aos-duration="1500">
                Jalan Gedung Acara 2
              </p>
              <p style={{ fontFamily: "'Adamina', sans-serif" }} className="tracking-[0.065rem] text-center text-base text-[#6A6357] mb-2 mt-3" data-aos="fade-up" data-aos-duration="1500">
                Sabtu, 9 April 2022
              </p>
              <p style={{ fontFamily: "'Adamina', sans-serif" }} className="tracking-[0.065rem] text-center text-base text-[#6A6357] leading-1 mb-3" data-aos="fade-up" data-aos-duration="1500">
                19:00 - 22:00 WIB
              </p>
            </div>
          </div> */}
        </div>

        {/* ============ LOVE STORY ============ */}
        <div ref={loveStoryRef} className="bg-[#EEEAE5] p-3 pb-10">
          <div className="relative py-16 mb-3" data-aos="fade" data-aos-delay="300" data-aos-duration="1000">
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
          <div className="overflow-x-hidden">
            <div className="embla" ref={emblaRef} data-aos="fade-left" data-aos-duration="1500">
              <div className="embla__container gap-x-5">
                {loveStories.map((item, index) => (
                  <div key={index} className="embla__slide w-full max-w-xs mx-auto bg-[#F4F1EA] rounded-xl p-3 shadow select-none cursor-grab active:cursor-grabbing">
                    <div className="border border-dashed rounded-xl py-3">
                      <p className="text-[#6A6357] text-center text-[22px] font-normal max-w-sm mx-auto uppercase" style={{ fontFamily: "'Adamina', serif" }}>
                        {item.title}
                      </p>
                      <p style={{ fontFamily: "'Adamina', sans-serif" }} className="text-center text-lg text-[#BF9E4E] mb-2">
                        {item.subtitle}
                      </p>
                      <hr className="border-dashed border-[#BF9E4E]" />
                      <p className="text-xs p-3 text-[#605921] leading-normal" style={{ fontFamily: "'Adamina', serif" }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ============ PHOTO GALLERY ============ */}
        <div ref={galleryRef} className="bg-[#EEEAE5] p-5 overflow-hidden" style={{ display: "none" }}>
          <p data-aos="fade-up" data-aos-delay="100" data-aos-duration="1500" className="text-[#6A6357] text-center text-[40px] md:text-5xl mt-3 mb-8" style={{ fontFamily: "VintageSignature, cursive" }}>
            Photo Gallery
          </p>

          <div className="grid grid-cols-3 gap-2 p-2 bg-[#f4f1ea] rounded">
            {galleriesData.map((item: string, i: number) => (
              <img
                key={i}
                src={item}
                alt={`gallery-${i}`}
                className="object-cover aspect-square rounded cursor-pointer"
                data-aos="fade-up"
                data-aos-delay={(150 + i * 150).toString()}
                data-aos-duration="800"
                onClick={() => {
                  setIndexImage(i);
                  setOpen(true);
                }}
              />
            ))}
          </div>

          {/* Lightbox */}
          <Lightbox open={open} close={() => setOpen(false)} index={indexImage} slides={galleriesData.map((src) => ({ src }))} />
        </div>

        {/* ============ PRAYERS & SAYINGS FORM ============ */}
        <div ref={greetingsRef} className="bg-[#EEEAE5] p-5 overflow-hidden">
          <div className="relative h-40 w-full max-w-xs mx-auto mb-5" data-aos="fade" data-aos-delay="300" data-aos-duration="1000">
            <img src="/images/butter-fly-bride.png" alt="butter-fly-bride.png" className="size-13 absolute bottom-10 left-6 md:left-6 -rotate-45" />
            <div style={{ fontFamily: '"Alika Misely", Georgia', fontFeatureSettings: '"ss05" on' }} className="text-[#6A6357] flex gap-x-3 items-center">
              <p className="text-[57px]">Doa</p>
              <span style={{ fontFamily: '"Abhaya Libre", serif', fontStyle: "normal" }} className="font-extrabold text-2xl translate-y-5">
                dan
              </span>
              <p className="text-[57px] flex-none absolute bottom-3 right-[calc(50%-100px)]">Ucapan</p>
            </div>
          </div>

          <div className="w-full max-w-sm mx-auto bg-[#F4F1EA] rounded-xl p-3 shadow">
            <form onSubmit={(event) => handleSubmit(event)} className="border border-dashed rounded-xl py-3 px-5">
              <div style={{ fontFamily: '"Adamina", serif' }} className="text-[#6A6357] mb-3" data-aos="fade-up" data-aos-duration="1500">
                <label htmlFor="nama" className="block font-normal mb-1">
                  Nama :
                </label>
                <input type="text" id="nama" placeholder="Nama" className="border border-[#AA9B13] bg-white w-full p-2 rounded" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div style={{ fontFamily: '"Adamina", serif' }} className="text-[#6A6357]" data-aos="fade-up" data-aos-duration="1500">
                <label htmlFor="message" className="block font-normal mb-1">
                  Ucapan :
                </label>
                <textarea id="message" className="border border-[#AA9B13] bg-white w-full p-2 rounded min-h-30 field-sizing-content" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ucapan...">
                  Huhuhaha
                </textarea>
              </div>
              <div className="w-full max-w-[220px] mx-auto mb-8 mt-4" data-aos="fade-up" data-aos-duration="1500">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-x-1 bg-[#fefced] border-2 mb-5 font-light text-lg uppercase border-[#BF9E50] rounded-full w-full py-1 text-[#6a6357] cursor-pointer hover:bg-[#FFEECE] hover:text-[#24364D] transition-colors duration-300"
                  style={{ fontFamily: '"Anaheim", sans-serif', fontOpticalSizing: "auto" }}
                >
                  <MailOpen size={20} className="opacity-50" /> {loading ? "Mengirim..." : "Kirim"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpenDialog(true)}
                  className="flex items-center justify-center gap-x-1 bg-[#fefced] border-2 mb-3 font-light text-lg uppercase border-[#BF9E50] rounded-full w-full py-1 text-[#6a6357] cursor-pointer hover:bg-[#FFEECE] hover:text-[#24364D] transition-colors duration-300"
                  style={{ fontFamily: '"Anaheim", sans-serif', fontOpticalSizing: "auto" }}
                >
                  <Gift size={20} className="opacity-50" /> Kado
                </button>
                {/* <button className="flex items-center justify-center gap-x-1 bg-[#fefced] border-2 font-light text-lg uppercase border-[#BF9E50] rounded-full w-full py-1 text-[#6a6357] cursor-pointer hover:bg-[#FFEECE] hover:text-[#24364D] transition-colors duration-300" style={{ fontFamily: '"Anaheim", sans-serif', fontOpticalSizing: "auto" }}>
                  <QrCode size={20} className="opacity-50" /> Rsvp / Kehadiran
                </button> */}
              </div>
              <div style={{ fontFamily: '"Adamina", serif' }} className="text-[#6A6357] max-w-[300px] mx-auto" data-aos="fade-up" data-aos-duration="1500">
                <p className="text-center mb-10">Atas doa & ucapan bapak/ibu/saudara/i, Kami mengucapkan terima kasih.</p>
                <p className="text-center mb-3">Salam</p>
                <p className="text-gradient text-[40px]">Adilfi & Lukman</p>
              </div>
            </form>
          </div>
        </div>

        {/* ============ Also Invite ============ */}
        <div className="bg-[#EEEAE5] p-5 overflow-hidden" style={{ display: "none" }}>
          <p className="text-[#6A6357] text-center text-[34px] md:text-4xl py-3 font-normal max-w-sm mx-auto" style={{ fontFamily: "'Alika Misely', Georgia" }} data-aos="fade-up" data-aos-duration="1500">
            Turut Mengundang
          </p>
          <p className="text-gradient text-[34px]">Kel. Mempelai Pria</p>
          <ol className="text-center text-[#6A6357] mb-5" data-aos="fade-up" data-aos-duration="1500">
            {groomSideFamilies.map((item, index) => (
              <li key={index} style={{ fontFamily: "'Alika Misely', Georgia" }} className="text-base leading-loose">
                {index + 1} {item}
              </li>
            ))}
          </ol>
          <p className="text-gradient text-[34px]">Kel. Mempelai Wanita</p>
          <ol className="text-center text-[#6A6357]" data-aos="fade-up" data-aos-duration="1500">
            {brideSideFamilies.map((item, index) => (
              <li key={index} style={{ fontFamily: "'Alika Misely', Georgia" }} className="text-base leading-loose">
                {index + 1} {item}
              </li>
            ))}
          </ol>
        </div>

        {/* ============ PRAYERS & SAYINGS LIST ============ */}
        <div className="bg-[#EEEAE5] p-5 overflow-hidden pt-10">
          <div
            className="w-[300px] h-[144px] rounded-[30px] mx-auto flex flex-col justify-center items-center relative"
            style={{
              background: `
                url(/images/cd-bg-2.png) no-repeat center,
                url(/images/cd-bg-1.png) no-repeat center
                `,
              backgroundSize: "calc(100% - 17px), 100%",
            }}
          >
            <div data-aos="fade-up" data-aos-delay="200" data-aos-duration="500" data-aos-anchor-placement="top-bottom">
              <div className="text-[#6A6357] flex gap-x-3" style={{ fontFamily: "'Alika Misely', georgia" }}>
                <p className="text-[#6A6357] text-center text-[22px] leading-none mb-2" style={{ fontFamily: "'Adamina', sans-serif" }}>
                  DOA <span className="text-[45px]">&</span> UCAPAN
                </p>
              </div>
              <p style={{ fontFamily: "'Adamina', sans-serif" }} className="tracking-[0.28rem] text-center text-base md:text-[18px] text-[#BF9E4E]">
                dari Undangan
              </p>
            </div>
          </div>
          <div className="w-full max-w-sm mx-auto bg-[#F4F1EA] rounded-3xl px-5 py-10 shadow-lg my-10">
            {greetings.map((item, index) => (
              <div key={index} style={{ fontFamily: '"Adamina", serif' }} className="text-[#24364D] max-w-xs mx-auto border-b border-dashed py-8" data-aos="fade-up" data-aos-delay={(150 + index * 150).toString()} data-aos-duration="800">
                <p className="text-center mb-5 text-sm leading-normal">{item.message}</p>
                <p className="text-center text-[#C09F4F]">{item.name}</p>
                <p className="text-gray-400 text-[10px] text-center">{item.createdAt ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: false, locale: id }) : ""} yang lalu</p>
              </div>
            ))}
            {greetings.length < 1 && (
              <div>
                <MailSearch size={50} className="text-[#C09F4F]/40 mx-auto mb-3" />
                <p className="text-[#C09F4F] text-center">Belum ada ucapan</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} title="Kado Digital">
        {bankAccounts.map((acc, i) => (
          <div key={i} style={{ fontFamily: '"Adamina", serif' }} className="text-[#6A6357] rounded-xl bg-gradient-to-r from-[#ebe5e0] to-[#e3c4a9] p-5 shadow mb-4">
            <small className="tracking-widest opacity-70 text-[11px] md:text-xs">Bank / Nama Rekening</small>
            <p className="mb-3 font-extrabold text-sm md:text-base">
              {acc.bank} / {acc.name}
            </p>

            <hr className="border-double border-[#d0bbab] my-3" />

            <small className="tracking-widest opacity-70 text-[11px] md:text-xs">Nomor Rekening</small>
            <div className="flex justify-between items-center">
              <p className="font-extrabold text-sm md:text-base tracking-[0.25rem]">{acc.number}</p>
              <button onClick={() => handleCopy(acc.number, acc.name)} className="p-2 hover:bg-gray-200 rounded cursor-pointer">
                <Copy size={18} />
              </button>
            </div>
          </div>
        ))}
      </Dialog>
    </>
  );
};

export default Home;
