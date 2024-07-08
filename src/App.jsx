import { useState } from "react";

import StartButton from "./components/Inicio";
import Title from "./components/Title";
import Board from "./components/Board";
import Panel from "./components/Panel";
import "./App.css";

export default function App() {
  const [mainPositions, setPositions] = useState(Array(10).fill(0, 2, 9));
  const [shadowPositions, setShadowPositions] = useState(mainPositions);
  const [isHeavenCurrentPlayer, setIsHeavenCurrentPlayer] = useState(true);
  const [isGameStarted, setGameStarted] = useState(false);
  // const [isGameOver, setGameOver] = useState(false);
  const [colState, setColState] = useState({
    active: Array(10).fill(false, 2, 9),
    closedForHeaven: Array(10).fill(false, 2, 9),
    /* This is a temporary condition*/
    ClosedForHell: Array(10).fill(false, 2, 9) /* This is */,
    locked: Array(10).fill(false, 2, 9),
    isAvailable: (x, isHeavenTurn) => {
      // Return an array
      // [0] = Is col x available to be moved 1 step for heave or hell?
      // [1] = Is col x available to be moved 2 steps for heaven or hell?

      const player = isHeavenTurn ? "HEAVEN" : "HELL";
      console.log("**** COLUMNA ", x, "~", player, "*****");

      const last = [undefined, undefined, 2, 4, 6, 8, 6, 4, 2];
      const NTLast = [undefined, undefined, 1, 3, 5, 7, 5, 3, 1];

      const shadowIsLast =
        (isHeavenTurn && shadowPositions[x] === last[x]) ||
        (!isHeavenTurn && shadowPositions[x] === -last[x]);
      console.log("Está shadow al final?: ", shadowIsLast);

      const shadowIsNextToLast =
        (isHeavenTurn && shadowPositions[x] === NTLast[x]) ||
        (!isHeavenTurn && shadowPositions[x] === -NTLast[x]);
      console.log("Está shadow al final?: ", shadowIsLast);

      const answer = [!shadowIsLast, !shadowIsLast && !shadowIsNextToLast];

      return answer;
    },
    hellScore: 0,
    heavenScore: 0,
    score: (text) => {
      const positionToScore = [undefined, undefined, 2, 3, 4, 5, 4, 3, 1];
      let hellScore = 0,
        heavenScore = 0;
      for (let column = 2; column === mainPositions.length; column++) {
        mainPositions[column] >= positionToScore[column] && heavenScore++;
        mainPositions[column] <= -positionToScore[column] && hellScore++;
      }
      if (text == "heaven") return heavenScore;
      if (text == "hell") return hellScore;
      return -1;
    },
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
      //console.log("Updated state:", newState); // Aquí se hace el console.log
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
        nextShadowPositions[col] + Math.pow(-1, !isHeavenCurrentPlayer);
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

  /*   const endGame = () => {
    setGameOver(true);
  }; */

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
          colState={colState}
          isHeavenCurrentPlayer={isHeavenCurrentPlayer}
        />
        <Panel
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
