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
const Panel = ({ handleShadowPositions, endTurn, updateActivity, gS }) => {
  /****************************
   ******   Inner Component
   *****************************/
  const LostTurn = () => (
    <button
      onClick={() => {
        endTurn(false);
        changePhase();
      }}
    >
      Lost turn!
    </button>
  );
  const [dados, setDados] = useState([0, 0, 0, 0]);
  const roll4Dice = () =>
    setDados([rollDx(4), rollDx(4), rollDx(4), rollDx(4)]);
  // setDados([1, 1, 1, 1]);

  const [isDicePhase, setDicePhase] = useState(true);

  const changePhase = () => {
    setDicePhase(!isDicePhase);
  };
  const className = gS.isHCP ? "heaven" : "hell";
  const isActiveColumn = gS.active; // Array. From 2 to 9 shows true or false

  const options = [
    [dados[0] + dados[1], dados[2] + dados[3]],
    [dados[0] + dados[2], dados[1] + dados[3]],
    [dados[0] + dados[3], dados[1] + dados[2]],
  ];
  let numOfActiveCols = isActiveColumn.filter((item) => item === true).length;

  /***********************************
   ******   OptionButton. A component
   **********************************/
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
          updateActivity(o1);
          o2 && updateActivity(o2);
        }}
        style={{ visibility: isDicePhase && "hidden" }}
        disabled={disabled}
      >
        {o1} {o2 ? " & " + o2 : ""}
      </button>
    );
  };

  const isXColAvailable = (x, isHeavenTurn) => {
    // x es la columna que se desea evaluar.
    // devuelve un vector de tres valores boleanos:
    // [isShadowLastForCP, isShadowNextToLastForCP, isLocked]

    // const player = isHeavenTurn ? "HEAVEN" : "HELL";
    // console.log("**** COLUMNA ", x, "~", player, "*****");

    const last = [undefined, undefined, 2, 4, 6, 8, 6, 4, 2];
    const NTLast = [undefined, undefined, 1, 3, 5, 7, 5, 3, 1];

    const shadowIsLast =
      (isHeavenTurn && gS.sPositions[x] === last[x]) ||
      (!isHeavenTurn && gS.sPositions[x] === -last[x]);
    // console.log("Está shadow al final?: ", shadowIsLast);

    const shadowIsNextToLast =
      (isHeavenTurn && gS.sPositions[x] === NTLast[x]) ||
      (!isHeavenTurn && gS.sPositions[x] === -NTLast[x]);
    // console.log("Está shadow al final?: ", shadowIsLast);

    /*     const colIsLocked = gS.locked[x];
    console.log(x + " is locked?: ", colIsLocked); */

    const answer = [!shadowIsLast, !shadowIsLast && !shadowIsNextToLast];
    // answer devuelve
    // [0] » x col is available for 1 step? (true or false)
    // [1] » x col is available for 2 steps? (true or false)

    return answer;
  };

  const multipliedOptions = [];

  /*******************************
   *  Feeding choseButonList
   *******************************/
  options.forEach((element) => {
    const [a, b] = [element[0], element[1]];
    const p = gS.isHCP;
    const aFor1Step = isXColAvailable(a, p)[0];
    const aFor2Steps = isXColAvailable(a, p)[1];
    const bFor1Step = isXColAvailable(b, p)[0];

    if (a === b) {
      if (
        numOfActiveCols <= 1 ||
        (numOfActiveCols === 2 && isActiveColumn[a])
      ) {
        aFor2Steps && multipliedOptions.push(element);
        aFor1Step && !aFor2Steps && multipliedOptions.push([a, false]);
      }
    } else {
      // a != b
      if (
        numOfActiveCols === 0 ||
        (numOfActiveCols === 1 && (isActiveColumn[a] || isActiveColumn[b])) ||
        (numOfActiveCols === 2 && isActiveColumn[a] && isActiveColumn[b])
      ) {
        aFor1Step && bFor1Step && multipliedOptions.push(element);
        aFor1Step && !bFor1Step && multipliedOptions.push([a, false]);
        !aFor1Step && bFor1Step && multipliedOptions.push([b, false]);
      }

      if (numOfActiveCols === 1 && !isActiveColumn[a] && !isActiveColumn[b]) {
        aFor1Step && multipliedOptions.push([a, false]);
        bFor1Step && multipliedOptions.push([b, false]);
      }

      if (numOfActiveCols === 2 && isActiveColumn[a] && !isActiveColumn[b]) {
        aFor1Step && multipliedOptions.push([a, false]);
      }

      if (numOfActiveCols === 2 && !isActiveColumn[a] && isActiveColumn[b]) {
        bFor1Step && multipliedOptions.push([b, false]);
      }
    }
  });

  // console.log("numOfActiveCols: ", numOfActiveCols);
  let k = 0;

  const aux = new Set(multipliedOptions);
  let unique = [...aux];

  const choseBuntonList = [];
  unique.forEach((element) => {
    const [a, b] = element;
    choseBuntonList.push(
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
    k++;
  });

  choseBuntonList.length === 0 &&
    !isDicePhase &&
    choseBuntonList.push(<LostTurn />);

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
      <div id="options">{choseBuntonList}</div>
    </div>
  );
};

export default Panel;
