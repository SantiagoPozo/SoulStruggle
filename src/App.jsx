import React, { useEffect } from "react";
import { GameProvider, useGameContext } from "./components/GameContext";
import Board from "./components/Board";
import Panel from "./components/Panel";
import VictoryMessage from "./components/Victory";
import "./style.sass";

const gC = {
  colsToWin: 3,
  diceSize: 4,
  puncPos: [undefined, undefined, 2, 3, 4, 5, 4, 3, 2],
  //I'm not going to make an adaptation with
  // cols from 2 to 12 and d6 dice, but it is an stimulating idea.
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gS.mPositions]);

  const updateScore = () => {
    let hl = 0,
      hv = 0,
      hlW = gS.winCount.hell,
      hvW = gS.winCount.heaven,
      winner = undefined;

    for (let n = 2; n < gS.mPositions.length; n++) {
      if (gS.mPositions[n] >= +gC.puncPos[n]) hv++;
      if (gS.mPositions[n] <= -gC.puncPos[n]) hl++;
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

  if (gS.isGameStarted && !gS.isGameOver) {
    return (
      <div id="gaming" className={gS.isHT ? "heaven" : "hell"}>
        <a
          id="rules-shortcut"
          href={`${process.env.PUBLIC_URL}/rules.html`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Rules
        </a>
        <Board key="board" />
        <Panel key="panel" />
      </div>
    );
  }

  if (gS.isGameOver) {
    const hl = gS.winCount.hell,
      hn = gS.winCount.heaven;
    return (
      <>
        <VictoryMessage key="v" />
        <Marcador key="m" hell={hl} heaven={hn} />
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
