import { useState, useEffect } from "react";

export const WeddingCountdown = ({ targetDate, className = "" }: { targetDate: string; className?: string }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
        setIsExpired(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
      }
    };

    // Hitung immediately
    calculateTimeLeft();

    // Update setiap detik
    const timer = setInterval(calculateTimeLeft, 1000);

    // Cleanup
    return () => clearInterval(timer);
  }, [targetDate]);

  if (isExpired) {
    return (
      <div className={className}>
        <p className="text-[37px] text-[#6A6357] text-center mb-2" style={{ fontFamily: "VintageSignature, cursive" }}>
          The Big Day!
        </p>
        <p className="text-[#6A6357] text-center" style={{ fontFamily: "'Alika Misely', georgia" }}>
          Hari yang ditunggu telah tiba! 🎉
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <p className="text-[37px] text-[#6A6357] text-center" style={{ fontFamily: "VintageSignature, cursive" }}>
        Save the Date
      </p>
      <div className="text-[#6A6357] flex gap-x-3" style={{ fontFamily: "'Alika Misely', georgia" }}>
        <span className="flex flex-col items-center">
          <span className="text-[27px] leading-none">{String(timeLeft.days).padStart(2, "0")}</span>
          <small className="text-base">Hari</small>
        </span>
        <span className="w-2 text-center self-center">:</span>
        <span className="flex flex-col items-center">
          <span className="text-[27px] leading-none">{String(timeLeft.hours).padStart(2, "0")}</span>
          <small className="text-base">Jam</small>
        </span>
        <span className="w-2 text-center self-center">:</span>
        <span className="flex flex-col items-center">
          <span className="text-[27px] leading-none">{String(timeLeft.minutes).padStart(2, "0")}</span>
          <small className="text-base">Menit</small>
        </span>
        <span className="w-2 text-center self-center">:</span>
        <span className="flex flex-col items-center">
          <span className="text-[27px] leading-none">{String(timeLeft.seconds).padStart(2, "0")}</span>
          <small className="text-base">Detik</small>
        </span>
      </div>
    </div>
  );
};
