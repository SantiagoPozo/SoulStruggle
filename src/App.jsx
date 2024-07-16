import { useState, useEffect } from "react";

import Inicio from "./components/Inicio";
import Board from "./components/Board";
import Panel from "./components/Panel";
import VictoryMessage from "./components/Victory";
import "./App.css";

const resizeBodyHeight = () => {
  const h = window.innerHeight;
  document.body.style.minHeight = h + "px";
};
window.addEventListener("load", resizeBodyHeight);
window.addEventListener("resize", resizeBodyHeight);

export const valuesAtTheBeginning = {
  gameID: 0,
  isGameStarted: false,
  isGameOver: false,
  isHCP: true, // Is Heaven Current Player?
  move: 0, // Some moves make a turn.
  turn: 0, // when passed o fail, end a turn.
  roll: [],
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
  diceSize: 4,
  posToPunc: [undefined, undefined, 2, 3, 4, 5, 4, 3, 2],
  //I'm not goint to make an adaptation for that with
  // cols from 2  to 12, but it is an estimulating idea.
};

export default function App() {
  const [gS, setGS] = useState({
    ...valuesAtTheBeginning,
  });
  const [history, setHistory] = useState([]);

  // console.log("gS queda definido", gS);

  useEffect(() => {
    updateScore();
  }, [gS.mPositions]);

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
      const heavenStarts = !((prv.winCount.hell + prv.winCount.heaven) % 2);
      const nxt = {
        ...prv,
        isGameStarted: true,
        isHCP: heavenStarts,
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
      <div id="gaming" class={gS.isHCP ? "heaven" : "hell"}>
        <Board gS={gS} />
        <Panel
          updateProgress={updateProgress}
          handleShadowPositions={handleShadowPositions}
          setGS={setGS}
          gS={gS}
        />
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
