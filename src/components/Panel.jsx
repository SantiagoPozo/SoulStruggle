import { useState } from "react";

const rollDx = (x) => {
  let result = Math.floor(x * Math.random() + 1);
  //Math.random devuelve un valor en [0, 1)
  return result;
};

const DivDado = (props) => {
  return (
    <div id={props.id} className="dado">
      {props.number}
    </div>
  );
};
const Panel = ({
  isGameActive,
  isHeavenCurrentPlayer,
  handleShadowPositions,
  shadowPositions,
  endTurn,
  updateActivity,
  colState,
  mainPositions,
}) => {
  const [dados, setDados] = useState([0, 0, 0, 0]);
  const roll4Dice = () =>
    setDados([rollDx(4), rollDx(4), rollDx(4), rollDx(4)]);
  const [isDicePhase, setDicePhase] = useState(true);

  const changePhase = () => {
    setDicePhase(!isDicePhase);
  };
  const className = isHeavenCurrentPlayer ? "heaven" : "hell";
  const isActiveColum = colState.active; // Array. From 2 to 9 shows true or false

  const options = [
    [dados[0] + dados[1], dados[2] + dados[3]],
    [dados[0] + dados[2], dados[1] + dados[3]],
    [dados[0] + dados[3], dados[1] + dados[2]],
  ];
  let numOfActiveCols = isActiveColum.filter((item) => item === true).length;

  const multipliedOptions = [];

  const components = [];

  /****************************
   ******   Inner Component
   *****************************/

  const OptionButton = ({
    o1,
    o2,
    handleShadowPositions,
    isDicePhase,
    changePhase,
    updateActivity,
    disabled,
  }) => {
    return (
      <button
        onClick={() => {
          changePhase();
          handleShadowPositions(o1);
          o2 && handleShadowPositions(o2);
          updateActivity(o1, true);
          o2 && updateActivity(o2, true);
        }}
        style={{ visibility: isDicePhase && "hidden" }}
        disabled={disabled}
      >
        {o1} {o2 ? " & " + o2 : ""}
      </button>
    );
  };

  /****************************
   ******   Inner Component
   *****************************/
  const LostTurn = ({ changePlayer }) => (
    <button
      onClick={() => {
        endTurn(false);
        changePhase();
      }}
    >
      Lost turn!
    </button>
  );

  options.forEach((element) => {
    const [a, b] = [element[0], element[1]];
    numOfActiveCols === 0 && multipliedOptions.push(element);

    numOfActiveCols === 1 &&
      (isActiveColum[a] || isActiveColum[b]) &&
      multipliedOptions.push([a, b]);

    if (numOfActiveCols === 1 && !isActiveColum[a] && !isActiveColum[b]) {
      multipliedOptions.push([a, false]);
      multipliedOptions.push([b, false]);
    }

    if (numOfActiveCols === 2) {
      isActiveColum[a] && isActiveColum[b] && multipliedOptions.push(element);
      isActiveColum[a] &&
        !isActiveColum[b] &&
        multipliedOptions.push([a, false]);
      !isActiveColum[a] &&
        isActiveColum[b] &&
        multipliedOptions.push([b, false]);
    }
  });

  console.log("numOfActiveCols: ", numOfActiveCols);
  let k = -1;
  multipliedOptions.forEach((element) => {
    k++;
    const [a, b] = element;
    components.push(
      <OptionButton
        key={k}
        o1={a}
        o2={b}
        handleShadowPositions={handleShadowPositions}
        isDicePhase={isDicePhase}
        changePhase={changePhase}
        updateActivity={updateActivity}
      />
    );
  });

  components.length == 0 &&
    !isDicePhase &&
    components.push(<LostTurn endTurn={endTurn} />);

  return (
    <div id="panel">
      <div id="dadum" className={className}>
        <DivDado id="dado0" key={"0"} number={dados[0]} />
        <DivDado id="dado1" key={"1"} number={dados[1]} />
        <DivDado id="dado2" key={"2"} number={dados[2]} />
        <DivDado id="dado3" key={"3"} number={dados[3]} />
        <button
          id="roll-button"
          style={{ visibility: isDicePhase ? "" : "hidden" }}
          onClick={() => {
            roll4Dice();
            changePhase();
          }}
          disabled={!isGameActive}
        >
          Roll the Dice
        </button>
        <button
          id="pass-button"
          onClick={() => {
            endTurn(true);
          }}
          style={{ visibility: isDicePhase ? "" : "hidden" }}
        >
          Pass
        </button>{" "}
      </div>
      <div id="options">{components}</div>
    </div>
  );
};

export default Panel;
