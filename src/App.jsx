import { useState, useEffect } from "react";

import StartButton from "./components/Inicio";
import Title from "./components/Title";
import Board from "./components/Board";
import Panel from "./components/Panel";
import VictoryMessage from "./components/Victory";
import "./App.css";

export default function App() {
  const [isHeavenCurrentPlayer, setIsHeavenCurrentPlayer] = useState(true);
  const valuesAtTheBeginning = {
    active: Array(10).fill(false, 2, 9),
    mPositions: Array(10).fill(0, 2, 9), //main Meeples positions
    sPositions: Array(10).fill(0, 2, 9), //shadow Meeples positions
    score: {
      hell: 0,
      heaven: 0,
    },
    isGameStarted: false,
    isGameOver: false,
    heavenWon: undefined,
  };

  const [gameState, setGameState] = useState({
    ...valuesAtTheBeginning,
    winCount: {
      hell: 0,
      heaven: 0,
    },
  });

  console.log("gameState queda definido", gameState);

  useEffect(() => {
    updateScore();
  }, [gameState.mPositions]);

  const updateActivity = (colIndex, newValue) => {
    setGameState((prevState) => {
      const newState = {
        ...prevState,
        active: [
          ...prevState.active.slice(0, colIndex),
          newValue,
          ...prevState.active.slice(colIndex + 1),
        ],
      };
      //console.log("Updated state:", newState);
      return newState;
    });
  };

  const updateProgress = (nextPositions) => {
    setGameState((prv) => ({
      ...prv,
      mPositions: [...nextPositions],
    }));

    for (let index = 2; index <= gameState.mPositions.length; index++) {
      updateActivity(index, false);
    }
  };

  const handleShadowPositions = (col) => {
    setGameState((prev) => {
      const next = {
        ...prev,
        sPositions: [
          ...prev.sPositions.slice(0, col),
          prev.sPositions[col] + Math.pow(-1, !isHeavenCurrentPlayer),
          ...prev.sPositions.slice(col + 1),
        ],
      };
      return next;
    });
  };

  const updateScore = () => {
    let hl = 0,
      hn = 0;
    const punctPositions = [undefined, undefined, 2, 3, 4, 5, 4, 3, 2];

    for (let n = 2; n < gameState.mPositions.length; n++) {
      if (gameState.mPositions[n] >= punctPositions[n]) hn++;
      if (gameState.mPositions[n] <= -punctPositions[n]) hl++;
    }

    setGameState((prevState) => ({
      ...prevState,
      score: { hell: hl, heaven: hn },
    }));

    hn >= 3 && endGame(true);
    hl >= 3 && endGame(false);
  };

  const endGame = (heavenWon) => {
    setGameState((prevState) => ({
      ...prevState,
      isGameOver: true,
      heavenWon: heavenWon,
    }));
  };

  const endTurn = (isSuccess) => {
    if (isSuccess) {
      // Player PASSED

      setGameState((prev) => {
        const next = {
          ...prev,
          mPositions: [...gameState.sPositions.slice()],
        };
        return next;
      });
    } else {
      // Player failed

      setGameState((prev) => {
        const next = {
          ...prev,
          sPositions: [...gameState.mPositions.slice()],
        };
        return next;
      });
    }
    setIsHeavenCurrentPlayer(!isHeavenCurrentPlayer);
    for (let index = 2; index <= gameState.mPositions.length; index++) {
      updateActivity(index, false);
    }
  };

  const startGame = () => {
    setGameState((prevState) => ({
      ...prevState,
      isGameStarted: true,
    }));
  };

  if (!gameState.isGameStarted) {
    return (
      <>
        <Title />
        <StartButton ini={startGame} />
      </>
    );
  }

  if (gameState.isGameStarted && !gameState.isGameOver) {
    return (
      <div id="gaming">
        <Board
          gameState={gameState}
          isHeavenCurrentPlayer={isHeavenCurrentPlayer}
        />
        <Panel
          isHeavenCurrentPlayer={isHeavenCurrentPlayer}
          updateProgress={updateProgress}
          handleShadowPositions={handleShadowPositions}
          endTurn={endTurn}
          gameState={gameState}
          updateActivity={updateActivity}
        />
      </div>
    );
  }
  if (gameState.isGameOver) {
    return (
      <VictoryMessage
        heavenWon={gameState.heavenWon}
        setGameState={setGameState}
      />
    );
  }
}
