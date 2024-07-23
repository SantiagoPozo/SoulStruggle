import React, { createContext, useState, useContext } from "react";
export const GameContext = createContext();

// Initial values of the game
export const valuesAtTheBeginning = {
  game: 0,
  move: 0, // Some moves make a turn.
  turn: 0, // when passed o fail, end a turn.
  isGameStarted: false,
  isGameOver: false,
  isHT: true, // Is Heaven's turn?
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
  mPositions: Array(9).fill(0, 2, 9), //main Meeples
  sPositions: Array(9).fill(0, 2, 9), //shadow Meeples
};

// Crea el proveedor del contexto
export const GameProvider = ({ children }) => {
  const [gS, setGS] = useState({
    ...valuesAtTheBeginning,
  });

  return (
    <GameContext.Provider value={{ gS, setGS }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  return useContext(GameContext);
};
