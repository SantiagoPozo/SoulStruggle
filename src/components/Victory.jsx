import { prettyDOM } from "@testing-library/react";

const VictoryMessage = ({ heavenWon, setGameState }) => {
  const message = (bol) => {
    if (bol) return "Heaven Won!";
    else return "Hell Won!";
  };

  const closeVictory = () => {
    setGameState((prevState) => {
      const newState = {
        ...prevState,
        isGameStarted: false,
        isGameOver: false,
        isHeavenVictory: undefined,
        isHellVictory: undefined,
      };
      return newState;
    });
  };

  return (
    <div id="victory-message" onClick={closeVictory}>
      <div>
        <p>{message(heavenWon)}</p>
        <p>Play Again...</p>
      </div>
    </div>
  );
};

export default VictoryMessage;
