import React, { useState, useEffect } from "react";
import { GameProvider, useGameContext } from "./components/GameContext";
import Inicio from "./components/Inicio";
import Board from "./components/Board";
// import Panel from "./components/Panel";
import Fanel from "./components/Fanel";
import VictoryMessage from "./components/Victory";
import "./App.css";

const resizeBodyHeight = () => {
  const h = window.innerHeight;
  document.body.style.minHeight = h + "px";
};
window.addEventListener("load", resizeBodyHeight);
window.addEventListener("resize", resizeBodyHeight);

const gC = {
  colsToWin: 3,
  diceSize: 4,
  posToPunc: [undefined, undefined, 2, 3, 4, 5, 4, 3, 2],
  //I'm not going to make an adaptation for that with
  // cols from 2  to 12, but it is an estimulating idea.
};

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

function AppContent() {
  const { gS, setGS } = useGameContext();
  // const [history, setHistory] = useState([]);}

  useEffect(() => {
    updateScore();
  }, [gS.mPositions]);

  const updateProgress = (nextPositions) => {
    setGS((prv) => ({
      ...prv,
      mPositions: [...nextPositions],
      active: Array(9).fill(false, 2, 9),
      turn: prv.turn + 1,
      move: 0,
    }));
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

    if (hv >= gC.colsToWin) {
      hvW++;
      winner = "heaven";
    }
    if (hl >= gC.colsToWin) {
      hlW++;
      winner = "hell";
    }
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

  const startGame = () => {
    setGS((prv) => {
      const heavenStarts = !(prv.game % 2);
      const nxt = {
        ...prv,
        isGameStarted: true,
        isHT: heavenStarts,
        gameID: prv.gameID + 1,
      };
      return nxt;
    });
  };

  if (!gS.isGameStarted) {
    return (
      <>
        <Inicio ini={startGame} />
      </>
    );
  }

  if (gS.isGameStarted && !gS.isGameOver) {
    return (
      <div id="gaming" className={gS.isHT ? "heaven" : "hell"}>
        <Board />
        <Fanel />
      </div>
    );
  }

  if (gS.isGameOver) {
    const hl = gS.winCount.hell,
      hn = gS.winCount.heaven;
    return (
      <>
        <VictoryMessage />
        <Marcador hell={hl} heaven={hn} />
      </>
    );
  }

  return null; // Si no se cumple ninguna condición
}

const Marcador = ({ hell, heaven }) => {
  return (
    <p id="marcador">
      Heaven {heaven} - {hell} Hell
    </p>
  );
};
