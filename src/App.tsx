import { useMemo, useState } from "react";
import "./App.css";
import { useGameState } from "./hooks/useGameState";
import { computeTitle } from "./utils/titles";
import { generateBossText, generateOjisanTranslation } from "./utils/textGen";
import { Home } from "./screens/Home";
import { Bingo } from "./screens/Bingo";
import { Result } from "./screens/Result";
import { DecoyCalculator } from "./components/DecoyCalculator";

type Screen = "home" | "bingo" | "result" | "decoy";

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [resultSnapshot, setResultSnapshot] = useState<{
    title: string;
    bossText: string;
    translation: string;
    selectedWords: ReturnType<typeof useGameState>["selectedWords"];
  } | null>(null);

  const game = useGameState();

  const currentTitle = useMemo(
    () => computeTitle(game.bingoCount, game.selectedWords.length),
    [game.bingoCount, game.selectedWords.length]
  );

  const handleEndMeeting = () => {
    const { text, usedWords } = generateBossText(game.selectedWords);
    const translation = generateOjisanTranslation(usedWords);
    setResultSnapshot({
      title: currentTitle,
      bossText: text,
      translation,
      selectedWords: game.selectedWords,
    });
    setScreen("result");
  };

  const handleReplay = () => {
    game.newMeeting();
    setResultSnapshot(null);
    setScreen("bingo");
  };

  return (
    <>
      {screen === "home" && <Home onStart={() => setScreen("bingo")} />}

      {screen === "bingo" && (
        <Bingo
          card={game.card}
          marked={game.marked}
          bingoCount={game.bingoCount}
          selectedCount={game.selectedWords.length}
          justBingo={game.justBingo}
          modalTitle={currentTitle}
          onToggle={game.toggleCell}
          onAcknowledgeBingo={game.acknowledgeBingo}
          onNewMeeting={game.newMeeting}
          onEndMeeting={handleEndMeeting}
          onHide={() => setScreen("decoy")}
          onAddCustomWord={game.addCustomWord}
        />
      )}

      {screen === "decoy" && <DecoyCalculator onExit={() => setScreen("bingo")} />}

      {screen === "result" && resultSnapshot && (
        <Result
          title={resultSnapshot.title}
          selectedWords={resultSnapshot.selectedWords}
          bossText={resultSnapshot.bossText}
          translation={resultSnapshot.translation}
          onReplay={handleReplay}
        />
      )}
    </>
  );
}

export default App;
