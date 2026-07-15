import { useMemo, useState } from "react";
import "./App.css";
import { useGameState } from "./hooks/useGameState";
import { computeTitleDefinition, computeScore } from "./utils/titles";
import { NO_TITLE } from "./data/titles";
import type { TitleDefinition } from "./data/titles";
import { generateMeetingMinutes, generateTranslation } from "./utils/textGen";
import {
  loadTitleCollection,
  recordTitleUnlock,
  resetTitleCollection,
  isTitleUnlocked,
} from "./utils/titleCollection";
import type { UnlockedTitleRecord } from "./utils/titleCollection";
import {
  loadMeetingMemories,
  addMeetingMemory,
  deleteMeetingMemory,
  deleteAllMeetingMemories,
} from "./utils/meetingMemory";
import type { MeetingMemory as MeetingMemoryData } from "./utils/meetingMemory";
import { Home } from "./screens/Home";
import { Bingo } from "./screens/Bingo";
import { Result } from "./screens/Result";
import { Collection } from "./screens/Collection";
import { MeetingMemory } from "./screens/MeetingMemory";
import { GlossaryModal } from "./components/GlossaryModal";

type Screen = "home" | "bingo" | "result" | "collection" | "memory";

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [screenBeforeOverlay, setScreenBeforeOverlay] = useState<Screen>("home");
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [titleRecords, setTitleRecords] = useState<UnlockedTitleRecord[]>(() => loadTitleCollection());
  const [meetingMemories, setMeetingMemories] = useState<MeetingMemoryData[]>(() => loadMeetingMemories());

  const [resultSnapshot, setResultSnapshot] = useState<{
    titleDef: TitleDefinition;
    isNewTitle: boolean;
    bingoCount: number;
    meetingMinutes: string;
    translation: string;
    selectedWords: ReturnType<typeof useGameState>["selectedWords"];
  } | null>(null);

  const game = useGameState();

  const selectedWordIds = useMemo(() => game.selectedWords.map((w) => w.id), [game.selectedWords]);

  const currentTitleDef = useMemo(
    () =>
      computeTitleDefinition({
        bingoCount: game.bingoCount,
        selectedWordCount: game.selectedWords.length,
        selectedWordIds,
      }),
    [game.bingoCount, game.selectedWords.length, selectedWordIds]
  );

  // ビンゴ成立モーダル用のプレビューNEW判定。永続化はせず、既存コレクションと照合するだけ。
  const currentTitleIsNew =
    game.justBingo && currentTitleDef.id !== NO_TITLE.id && !isTitleUnlocked(currentTitleDef.id, titleRecords);

  const openOverlay = (target: Screen, from: Screen) => {
    setScreenBeforeOverlay(from);
    setScreen(target);
  };

  const handleEndMeeting = () => {
    const { text, usedWords, category } = generateMeetingMinutes(game.selectedWords);
    const translation = generateTranslation(usedWords, category);
    const nowIso = new Date().toISOString();
    const score = computeScore(game.bingoCount, game.selectedWords.length);
    const titleDef = currentTitleDef;

    let isNewTitle = false;
    if (titleDef.id !== NO_TITLE.id) {
      const { records, isNew } = recordTitleUnlock(
        titleDef.id,
        { score, bingoCount: game.bingoCount, selectedWordCount: game.selectedWords.length },
        nowIso
      );
      setTitleRecords(records);
      isNewTitle = isNew;
    }

    const memories = addMeetingMemory(
      {
        titleId: titleDef.id,
        bingoCount: game.bingoCount,
        selectedWordCount: game.selectedWords.length,
        score,
        selectedWordIds,
        selectedWordLabels: game.selectedWords.map((w) => w.label),
        meetingMinutes: text,
        translation,
      },
      nowIso
    );
    setMeetingMemories(memories);

    setResultSnapshot({
      titleDef,
      isNewTitle,
      bingoCount: game.bingoCount,
      meetingMinutes: text,
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
      {screen === "home" && (
        <Home
          onStart={() => setScreen("bingo")}
          onOpenGlossary={() => setGlossaryOpen(true)}
          onOpenCollection={() => openOverlay("collection", "home")}
          onOpenMemory={() => openOverlay("memory", "home")}
        />
      )}

      {screen === "bingo" && (
        <Bingo
          card={game.card}
          marked={game.marked}
          bingoCount={game.bingoCount}
          selectedCount={game.selectedWords.length}
          justBingo={game.justBingo}
          modalTitle={currentTitleDef.name}
          modalTitleImagePath={currentTitleDef.imagePath}
          modalTitleIsNew={currentTitleIsNew}
          onToggle={game.toggleCell}
          onAcknowledgeBingo={game.acknowledgeBingo}
          onNewMeeting={game.newMeeting}
          onEndMeeting={handleEndMeeting}
          onAddCustomWord={game.addCustomWord}
          onOpenGlossary={() => setGlossaryOpen(true)}
        />
      )}

      {screen === "result" && resultSnapshot && (
        <Result
          titleDef={resultSnapshot.titleDef}
          isNewTitle={resultSnapshot.isNewTitle}
          bingoCount={resultSnapshot.bingoCount}
          selectedWords={resultSnapshot.selectedWords}
          meetingMinutes={resultSnapshot.meetingMinutes}
          translation={resultSnapshot.translation}
          onReplay={handleReplay}
          onViewCollection={() => openOverlay("collection", "result")}
        />
      )}

      {screen === "collection" && (
        <Collection
          records={titleRecords}
          onClose={() => setScreen(screenBeforeOverlay)}
          onReset={() => {
            resetTitleCollection();
            setTitleRecords([]);
          }}
        />
      )}

      {screen === "memory" && (
        <MeetingMemory
          memories={meetingMemories}
          onClose={() => setScreen(screenBeforeOverlay)}
          onDeleteOne={(id) => setMeetingMemories(deleteMeetingMemory(id))}
          onDeleteAll={() => setMeetingMemories(deleteAllMeetingMemories())}
        />
      )}

      {glossaryOpen && (
        <GlossaryModal customWords={game.customWords} onClose={() => setGlossaryOpen(false)} />
      )}
    </>
  );
}

export default App;
