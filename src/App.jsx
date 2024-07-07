import { useState } from "react";

import StartButton from "./components/Inicio";
import Title from "./components/Title";
import Board from "./components/Board";
import Panel from "./components/Panel";
import "./App.css";

export default function App() {
  const [mainPositions, setPositions] = useState(Array(10).fill(0, 2, 9));
  const [shadowPositions, setShadowPositions] = useState(
    Array(10).fill(0, 2, 9)
  );
  const [isHeavenCurrentPlayer, setIsHeavenCurrentPlayer] = useState(true);
  const [isGameStarted, setGameStarted] = useState(false);
  const [isGameOver, setGameOver] = useState(false);
  const [colState, setColState] = useState({
    active: Array(10).fill(false, 2, 9),
    closed: Array(10).fill(false, 2, 9),
    locked: Array(10).fill(false, 2, 9),
  });

  const updateActivity = (index, newValue) => {
    setColState((prevState) => {
      const newState = {
        ...prevState,
        active: [
          ...prevState.active.slice(0, index),
          newValue,
          ...prevState.active.slice(index + 1),
        ],
      };
      console.log("Updated state:", newState); // Aquí se hace el console.log
      return newState;
    });
  };

  const setProgress = (nextPositions) => {
    setPositions(nextPositions);
    for (let index = 2; index <= mainPositions.length; index++) {
      updateActivity(index, false);
    }
  };

  const handleShadowPositions = (col) => {
    setShadowPositions((prevShadowPositions) => {
      const nextShadowPositions = prevShadowPositions.slice();
      nextShadowPositions[col] =
        nextShadowPositions[col] + Math.pow(-1, isHeavenCurrentPlayer);
      return nextShadowPositions;
    });
  };

  const endTurn = (isSuccess) => {
    if (isSuccess) {
      // Player PASSED
      setProgress(shadowPositions);
    } else {
      // Player failed
      setShadowPositions(mainPositions);
    }
    setIsHeavenCurrentPlayer(!isHeavenCurrentPlayer);
    for (let index = 2; index <= mainPositions.length; index++) {
      updateActivity(index, false);
    }
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const endGame = () => {
    setGameOver(true);
  };

  // console.log("mainPositions", mainPositions);
  if (!isGameStarted) {
    return (
      <>
        <Title />
        <StartButton ini={startGame} />
      </>
    );
  } else {
    return (
      <div id="gaming">
        <Board
          mainPositions={mainPositions}
          shadowPositions={shadowPositions}
          isHeavenCurrentPlayer={isHeavenCurrentPlayer}
        />
        <Panel
          isGameActive={isGameStarted && !isGameOver}
          isHeavenCurrentPlayer={isHeavenCurrentPlayer}
          setProgress={setProgress}
          shadowPositions={shadowPositions}
          handleShadowPositions={handleShadowPositions}
          endTurn={endTurn}
          colState={colState}
          updateActivity={updateActivity}
          mainPositions={mainPositions}
        />
      </div>
    );
  }
}
