import { useState, useEffect } from "react";

import StartButton from "./components/Inicio";
import Title from "./components/Title";
import Board from "./components/Board";
import Panel from "./components/Panel";
import VictoryMessage from "./components/Victory";
import "./App.css";

export const valuesAtTheBeginning = {
  isGameStarted: false,
  isGameOver: false,
  isHCP: true,
  score: {
    hell: 0,
    heaven: 0,
  },
  winner: undefined,
  winCount: {
    hell: 0,
    heaven: 0,
  },
  active: Array(9).fill(false, 2, 9),
  mPositions: Array(9).fill(0, 2, 9), //main Meeples
  sPositions: Array(9).fill(0, 2, 9), //shadow Meeples
};

const gC = {
  colsToWin: 3,
  posToPunc: [undefined, undefined, 2, 3, 4, 5, 4, 3, 2],
};

export default function App() {
  const [gS, setGS] = useState({
    ...valuesAtTheBeginning,
  });

  console.log("gS queda definido", gS);

  useEffect(() => {
    updateScore();
  }, [gS.mPositions]);

  const updateActivity = (colIndex) => {
    setGS((prv) => {
      const nxt = {
        ...prv,
        active: [
          ...prv.active.slice(0, colIndex),
          true,
          ...prv.active.slice(colIndex + 1),
        ],
      };
      return nxt;
    });
  };

  const updateProgress = (nextPositions) => {
    setGS((prv) => ({
      ...prv,
      mPositions: [...nextPositions],
      active: Array(9).fill(false, 2, 9),
    }));
  };

  const handleShadowPositions = (col) => {
    setGS((prev) => {
      const next = {
        ...prev,
        sPositions: [
          ...prev.sPositions.slice(0, col),
          prev.sPositions[col] + Math.pow(-1, !gS.isHCP),
          ...prev.sPositions.slice(col + 1),
        ],
      };
      return next;
    });
  };

  const updateScore = () => {
    let hl = 0,
      hv = 0,
      hlW = gS.winCount.hell,
      hvW = gS.winCount.heaven,
      winner = undefined;

    for (let n = 2; n < gS.mPositions.length; n++) {
      if (gS.mPositions[n] >= +gC.posToPunc[n]) hv++;
      if (gS.mPositions[n] <= -gC.posToPunc[n]) hl++;
    }

    hv >= gC.colsToWin && (hvW++ || (winner = "heaven"));
    hl >= gC.colsToWin && (hlW++ || (winner = "hell"));

    const isOver = hl >= gC.colsToWin || hv >= gC.colsToWin;

    setGS((prv) => {
      const next = {
        ...prv,
        score: {
          heaven: hv,
          hell: hl,
        },
        winCount: {
          heaven: hvW,
          hell: hlW,
        },
        winner: winner,
        isGameOver: isOver,
      };

      return next;
    });
  };

  const endTurn = (isSuccess) => {
    if (isSuccess) {
      // Player PASSED

      setGS((prev) => {
        const next = {
          ...prev,
          mPositions: [...prev.sPositions.slice()],
          isHCP: !prev.isHCP,
          active: Array(9).fill(false, 2, 9),
        };
        return next;
      });
    } else {
      // Player failed

      setGS((prev) => {
        const next = {
          ...prev,
          sPositions: [...prev.mPositions.slice()],
          isHCP: !prev.isHCP,
          active: Array(9).fill(false, 2, 9),
        };
        return next;
      });
    }
  };

  const startGame = () => {
    setGS((prevState) => ({
      ...prevState,
      isGameStarted: true,
    }));
  };

  if (!gS.isGameStarted) {
    return (
      <>
        <Title />
        <StartButton ini={startGame} />
        <Marcador hell={gS.winCount.hell} heaven={gS.winCount.heaven} />
      </>
    );
  }

  if (gS.isGameStarted && !gS.isGameOver) {
    return (
      <div id="gaming">
        <Board gS={gS} />
        <Panel
          updateProgress={updateProgress}
          handleShadowPositions={handleShadowPositions}
          endTurn={endTurn}
          gS={gS}
          updateActivity={updateActivity}
        />
        <Marcador hell={gS.winCount.hell} heaven={gS.winCount.heaven} />
      </div>
    );
  }
  if (gS.isGameOver) {
    return (
      <>
        <VictoryMessage gS={gS} setGS={setGS} />
        <Marcador hell={gS.winCount.hell} heaven={gS.winCount.heaven} />
      </>
    );
  }
}

const Marcador = ({ hell, heaven }) => {
  return (
    <p id="marcador">
      Heaven {heaven} - {hell} Hell
    </p>
  );
};
