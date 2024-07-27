import { getMouseEventOptions } from "@testing-library/user-event/dist/utils";
import React, { createContext, useState, useContext } from "react";
export const GameContext = createContext();

// Initial values of the game
export const valuesAtTheBeginning = {
  game: 0,
  move: 0, // Some moves make a turn.
  turn: 0, // when passed o fail, end a turn.
  isGameStarted: false,
  isGameOver: false,
  isHT: false, // Is Heaven's turn?
  isRollDicePhase: true,
  roll: [0, 0, 0, 0],
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
  /*   mPositions: Array(9).fill(0, 2, 9), //main Meeples
  sPositions: Array(9).fill(0, 2, 9), //shadow Meeples */
  mPositions: [undefined, undefined, 0, 0, 0, 0, 0, 0, 0],
  sPositions: [undefined, undefined, 0, 0, 0, 0, 0, 0, 0],
};

// Crea el proveedor del contexto
export const GameProvider = ({ children }) => {
  const [gS, setGS] = useState({
    ...valuesAtTheBeginning,
  });

  const advanceShadows = (o1 = false, o2 = false) => {
    setGS((prv) => {
      const act = [...prv.active.slice()];
      o1 && (act[o1] = true);
      o2 && (act[o2] = true);

      const shadow = [...prv.sPositions.slice()];
      o1 && o2 && (shadow[o1] = shadow[o1] + Math.pow(-1, !prv.isHT));
      o1 && o2 && (shadow[o2] = shadow[o2] + Math.pow(-1, !prv.isHT));
      o1 && !o2 && (shadow[o1] = shadow[o1] + Math.pow(-1, !prv.isHT));
      o2 && !o1 && (shadow[o2] = shadow[o2] + Math.pow(-1, !prv.isHT));

      return {
        ...prv,
        active: act,
        sPositions: shadow,
        move: prv.move + 1,
        isRollDicePhase: true,
      };
    });
  };
  return (
    <GameContext.Provider value={{ gS, setGS, advanceShadows }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  return useContext(GameContext);
};
