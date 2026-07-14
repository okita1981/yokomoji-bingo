import { useRef, useState } from "react";

type Props = {
  onExit: () => void;
};

const LONG_PRESS_MS = 900;

const BUTTONS = [
  "7", "8", "9", "÷",
  "4", "5", "6", "×",
  "1", "2", "3", "−",
  "0", ".", "=", "+",
];

export function DecoyCalculator({ onExit }: Props) {
  const [display, setDisplay] = useState("0");
  const pressTimer = useRef<number | null>(null);

  const handleDigit = (val: string) => {
    setDisplay((prev) => {
      if (prev === "0" && val !== ".") return val;
      if (prev.length > 12) return prev;
      return prev + val;
    });
  };

  const handleAcPressStart = () => {
    pressTimer.current = window.setTimeout(() => {
      onExit();
    }, LONG_PRESS_MS);
  };

  const handleAcPressEnd = () => {
    if (pressTimer.current) {
      window.clearTimeout(pressTimer.current);
      pressTimer.current = null;
      setDisplay("0");
    }
  };

  return (
    <div className="decoy-screen">
      <div className="decoy-display">{display}</div>
      <div className="decoy-grid">
        <button
          type="button"
          className="decoy-btn decoy-ac"
          onPointerDown={handleAcPressStart}
          onPointerUp={handleAcPressEnd}
          onPointerLeave={handleAcPressEnd}
        >
          AC
        </button>
        {BUTTONS.map((b) => (
          <button
            key={b}
            type="button"
            className="decoy-btn"
            onClick={() => handleDigit(b)}
          >
            {b}
          </button>
        ))}
      </div>
    </div>
  );
}
