import { prettyDOM } from "@testing-library/react";
import { valuesAtTheBeginning } from "../App";

const VictoryMessage = ({ gS, setGS }) => {
  let message = "";

  if (gS.score.heaven >= 3) message = "Heaven won!";
  if (gS.score.hell >= 3) message = "Hell won!";

  const closeVictory = () => {
    const heavenStart = (gS.winCount.hell + gS.winCount.heaven) % 2;
    setGS((prv) => {
      const nxt = {
        ...valuesAtTheBeginning,
        isHCP: heavenStart,
        winCount: {
          hell: prv.winCount.hell,
          heaven: prv.winCount.heaven,
        },
      };

      return nxt;
    });
  };

  return (
    <div id="victory-message" onClick={closeVictory}>
      <div>
        <p>{message}</p>
        <p>Play Again...</p>
        <p>
          Heaven {gS.winCount.heaven} - {gS.winCount.hell} Hell
        </p>
      </div>
    </div>
  );
};

export default VictoryMessage;
