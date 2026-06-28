import { useState, useEffect } from "react";

const LIVE_SERVICE_TIMES: { day: number; startHour: number; endHour: number }[] = [
  { day: 0, startHour: 9, endHour: 13 },  // Sunday 09:00-13:00
  { day: 3, startHour: 18, endHour: 20 }, // Wednesday 18:00-20:00
  { day: 5, startHour: 18, endHour: 20 }, // Friday 18:00-20:00
];

function checkIsLiveNow(): boolean {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  return LIVE_SERVICE_TIMES.some(
    (s) => s.day === day && hour >= s.startHour && hour < s.endHour
  );
}

export function useIsLiveNow(): boolean {
  const [isLive, setIsLive] = useState(checkIsLiveNow());

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive(checkIsLiveNow());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  return isLive;
}
