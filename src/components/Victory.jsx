import { prettyDOM } from "@testing-library/react";
import { valuesAtTheBeginning } from "../App";

const VictoryMessage = ({ gS, setGS }) => {
  let message = "";

  if (gS.score.heaven >= 3) message = "Heaven won!";
  if (gS.score.hell >= 3) message = "Hell won!";

  const closeVictory = () => {
    setGS((prv) => {
      const nxt = {
        ...valuesAtTheBeginning,
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
    <div id="victory-message" className={className} onClick={closeVictory}>
      <div>
        <p>{message}</p>
        <p>Play Again...</p>
        <p>
          Heaven {gS.score.heaven} - {gS.score.hell} Hell
        </p>
      </div>
    </div>
  );
};

export default VictoryMessage;
