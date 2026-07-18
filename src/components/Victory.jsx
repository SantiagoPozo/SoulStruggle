import React from "react";
import { useGameContext } from "./GameContext";
import { valuesAtTheBeginning } from "./GameContext";

const VictoryMessage = () => {
  const { gS, setGS } = useGameContext();
  let message = "";

  if (gS.score.heaven >= 3) message = "Heaven won ";
  if (gS.score.hell >= 3) message = "Hell won ";
  message += gS.score.heaven + " - " + gS.score.hell;

  const closeVictory = () => {
    setGS((prv) => {
      let isHT = prv.winner === "hell";

      const nxt = {
        ...valuesAtTheBeginning,
        game: prv.game + 1,
        isHT: isHT,
        isGameStarted: true,
        winCount: {
          hell: prv.winCount.hell,
          heaven: prv.winCount.heaven,
        },
      };

      return nxt;
    });
  };

  const className = gS.winner;

  return (
    <div class="center">
      <button id="victory-message" className={className} onClick={closeVictory}>
        <div>
          <p>{message}</p>
          <p>Play Again...</p>
        </div>
      </button>
    </div>
  );
};

export default VictoryMessage;
