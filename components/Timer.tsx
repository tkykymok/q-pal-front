import { useState, useEffect, useRef, FC } from 'react';

interface TimerProps {
  onTimesUp?: () => void;
}

const Timer: FC<TimerProps> = ({ onTimesUp }) => {
  const [timeLeft, setTimeLeft] = useState(0.1 * 60); // 0.1 minutes * 60 seconds
  const timerIdRef = useRef<NodeJS.Timeout | undefined>();

  useEffect(() => {
    if (timeLeft > 0) {
      timerIdRef.current = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
    } else if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
    }

    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
      }
    };
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && onTimesUp) {
      onTimesUp();
    }
  }, [timeLeft, onTimesUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex space-x-2">
      <div>保留時間残り:</div>
      <div className={`${timeLeft === 0 && 'text-red-500'}`}>
        {minutes}:{seconds < 10 ? '0' : ''}
        {seconds}
      </div>
    </div>
  );
};

export default Timer;
