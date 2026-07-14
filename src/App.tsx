import { useMemo, useState } from "react";
import "./App.css";
import { useGameState } from "./hooks/useGameState";
import { computeTitleDefinition } from "./utils/titles";
import type { TitleDefinition } from "./data/titles";
import { generateBossText, generateOjisanTranslation } from "./utils/textGen";
import { Home } from "./screens/Home";
import { Bingo } from "./screens/Bingo";
import { Result } from "./screens/Result";

type Screen = "home" | "bingo" | "result";

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [resultSnapshot, setResultSnapshot] = useState<{
    titleDef: TitleDefinition;
    bingoCount: number;
    bossText: string;
    translation: string;
    selectedWords: ReturnType<typeof useGameState>["selectedWords"];
  } | null>(null);

  const game = useGameState();

  const currentTitleDef = useMemo(
    () => computeTitleDefinition(game.bingoCount, game.selectedWords.length),
    [game.bingoCount, game.selectedWords.length]
  );

  const handleEndMeeting = () => {
    const { text, usedWords } = generateBossText(game.selectedWords);
    const translation = generateOjisanTranslation(usedWords);
    setResultSnapshot({
      titleDef: currentTitleDef,
      bingoCount: game.bingoCount,
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
          modalTitle={currentTitleDef.name}
          onToggle={game.toggleCell}
          onAcknowledgeBingo={game.acknowledgeBingo}
          onNewMeeting={game.newMeeting}
          onEndMeeting={handleEndMeeting}
          onAddCustomWord={game.addCustomWord}
          customWords={game.customWords}
        />
      )}

      {screen === "result" && resultSnapshot && (
        <Result
          titleDef={resultSnapshot.titleDef}
          bingoCount={resultSnapshot.bingoCount}
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
