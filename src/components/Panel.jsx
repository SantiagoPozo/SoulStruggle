import React, { useState } from "react";
import { useGameContext } from "./GameContext";

const rollDx = (x) => Math.floor(x * Math.random() + 1);
//Math.random devuelve un valor en [0, 1)

const randomFace = () => {
  const f = ["🙁", "😕", "😢", "😖", "😱", "😤", "😠", "🤬", "😓"];
  return f[Math.floor(9 * Math.random())];
};

const Dado = (props) => (
  <div id={props.id} className={"dado " + props.className}>
    <div>{props.number}</div>
  </div>
);

const Panel = () => {
  const { gS, setGS } = useGameContext();

  /****************************
   ******   Inner Component
   *****************************/
  const LostTurn = () => (
    <button
      onClick={() => {
        setGS((prev) => {
          const next = {
            ...prev,
            sPositions: [...prev.mPositions.slice()],
            isHT: !prev.isHT,
            active: Array(9).fill(false, 2, 9),
            turn: prev.turn + 1,
            move: 0,
            isRollDicePhase: true,
          };
          return next;
        });
      }}
    >
      Lost turn!
    </button>
  );
  const [dados, setDados] = useState([0, 0, 0, 0]);
  const roll4Dice = () =>
    setDados([rollDx(4), rollDx(4), rollDx(4), rollDx(4)]);

  // setDados([1, 1, 1, 1]);

  const className = gS.isHT ? "heaven" : "hell";
  const isActiveColumn = gS.active; // Array. From 2 to 9 shows true or false

  const options = [
    [
      dados[0] + dados[1],
      dados[2] + dados[3],
      dados[0],
      dados[1],
      dados[2],
      dados[3],
    ],
    [
      dados[0] + dados[2],
      dados[1] + dados[3],
      dados[0],
      dados[2],
      dados[1],
      dados[3],
    ],
    [
      dados[0] + dados[3],
      dados[1] + dados[2],
      dados[0],
      dados[3],
      dados[1],
      dados[2],
    ],
  ];

  let numOfActiveCols = isActiveColumn.filter((item) => item === true).length;

  /***********************************
   ******   OptionDiv. A component
   **********************************/
  const OptionDiv = ({ array }) => {
    const updateActivity = (colIndex) => {
      setGS((prv) => {
        const nxt = {
          ...prv,
          active: [
            ...prv.active.slice(0, colIndex),
            true,
            ...prv.active.slice(colIndex + 1),
          ],
        };
        return nxt;
      });
    };

    const moveOneStepShadowMeeple = (col) => {
      setGS((prev) => {
        const next = {
          ...prev,
          sPositions: [
            ...prev.sPositions.slice(0, col),
            prev.sPositions[col] + Math.pow(-1, !gS.isHT),
            ...prev.sPositions.slice(col + 1),
          ],
        };
        return next;
      });
    };
    const [o1, o2, d1, d2, d3, d4] = array;

    return (
      <div className={gS.isHT ? "origin heaven" : "origin hell"}>
        <div className="dice-case">
          <div id="first-pair" className="pair">
            <Dado key="0" number={d1} />
            <Dado key="1" number={d2} />
          </div>{" "}
          &
          <div id="second-pair" className="pair">
            <Dado key="2" number={d3} />
            <Dado key="3" number={d4} />
          </div>
        </div>
        <button
          className={"option-button"}
          onClick={() => {
            if (o1) {
              moveOneStepShadowMeeple(o1);
              updateActivity(o1);
            }
            if (o2) {
              moveOneStepShadowMeeple(o2);
              updateActivity(o2);
            }

            setGS((prv) => ({
              ...prv,
              move: prv.move + 1,
              isRollDicePhase: true,
            }));
          }}
        >
          {o1 ? o1 : randomFace()} {o2 ? " & " + o2 : randomFace()}
        </button>
      </div>
    );
  };

  const isXColAvailable = (x, isHeavenTurn) => {
    // Evaluate col x

    const last = [undefined, undefined, 2, 4, 6, 8, 6, 4, 2];
    const NTLast = [undefined, undefined, 1, 3, 5, 7, 5, 3, 1];

    const shadowIsLast =
      (isHeavenTurn && gS.sPositions[x] === last[x]) ||
      (!isHeavenTurn && gS.sPositions[x] === -last[x]);
    // console.log("Está shadow al final?: ", shadowIsLast);

    const shadowIsNextToLast =
      (isHeavenTurn && gS.sPositions[x] === NTLast[x]) ||
      (!isHeavenTurn && gS.sPositions[x] === -NTLast[x]);

    const answer = [!shadowIsLast, !shadowIsLast && !shadowIsNextToLast];
    // answer returns
    // [0] » x col is available for 1 step ? (true or false)
    // [1] » x col is available for 2 steps? (true or false)

    return answer;
  };

  const multipliedOptions = [];

  /*******************************
   *  Feeding choseButtonList
   *******************************/
  options.forEach((element) => {
    const [a, b] = [element[0], element[1]];
    const p = gS.isHT;
    const aFor1Step = isXColAvailable(a, p)[0];
    const aFor2Steps = isXColAvailable(a, p)[1];
    const bFor1Step = isXColAvailable(b, p)[0];

    if (a === b) {
      if (
        numOfActiveCols <= 1 ||
        (numOfActiveCols === 2 && isActiveColumn[a])
      ) {
        aFor2Steps && multipliedOptions.push(element);
        aFor1Step &&
          !aFor2Steps &&
          multipliedOptions.push([
            a,
            false,
            element[2],
            element[3],
            element[4],
            element[5],
          ]);
      }
    } else {
      // a != b
      if (
        numOfActiveCols === 0 ||
        (numOfActiveCols === 1 && (isActiveColumn[a] || isActiveColumn[b])) ||
        (numOfActiveCols === 2 && isActiveColumn[a] && isActiveColumn[b])
      ) {
        aFor1Step && bFor1Step && multipliedOptions.push(element);
        aFor1Step &&
          !bFor1Step &&
          multipliedOptions.push([
            a,
            false,
            element[2],
            element[3],
            element[4],
            element[5],
          ]);
        !aFor1Step &&
          bFor1Step &&
          multipliedOptions.push([
            false,
            b,
            element[2],
            element[3],
            element[4],
            element[5],
          ]);
      }

      if (numOfActiveCols === 1 && !isActiveColumn[a] && !isActiveColumn[b]) {
        aFor1Step &&
          multipliedOptions.push([
            a,
            false,
            element[2],
            element[3],
            element[4],
            element[5],
          ]);
        bFor1Step &&
          multipliedOptions.push([
            false,
            b,
            element[2],
            element[3],
            element[4],
            element[5],
          ]);
      }

      if (numOfActiveCols === 2 && isActiveColumn[a] && !isActiveColumn[b]) {
        aFor1Step &&
          multipliedOptions.push([
            a,
            false,
            element[2],
            element[3],
            element[4],
            element[5],
          ]);
      }

      if (numOfActiveCols === 2 && !isActiveColumn[a] && isActiveColumn[b]) {
        bFor1Step &&
          multipliedOptions.push([
            false,
            b,
            element[2],
            element[3],
            element[4],
            element[5],
          ]);
      }
    }
  });

  // console.log("numOfActiveCols: ", numOfActiveCols);
  let k = 0;

  const aux = new Set(multipliedOptions);
  let unique = [...aux];

  const choseButtonList = [];
  unique.forEach((element) => {
    choseButtonList.push(<OptionDiv key={k} array={element} />);
    k++;
  });

  choseButtonList.length === 0 &&
    !gS.isRollDicePhase &&
    choseButtonList.push(<LostTurn key="0" />);
  const par = gS.move % 2 ? "par" : undefined;

  return (
    <div id="panel" className={gS.isHT ? "heaven" : "hell"}>
      <div id="dadum" className={className}>
        <Dado id="dado0" className={par} key={"0"} number={dados[0]} />
        <Dado id="dado1" className={par} key={"1"} number={dados[1]} />
        <Dado id="dado2" className={par} key={"2"} number={dados[2]} />
        <Dado id="dado3" className={par} key={"3"} number={dados[3]} />
      </div>
      <div className="in-game-buttons">
        <button
          id="roll-button"
          className={!gS.isRollDicePhase ? "disappear" : undefined}
          onClick={() => {
            roll4Dice();
            setGS((prv) => ({
              ...prv,
              roll: dados,
              move: prv.move + 1,
              isRollDicePhase: false,
            }));
          }}
        >
          Roll the Dice
        </button>
        <button
          id="pass-button"
          className={
            !gS.isRollDicePhase || gS.move === 0 ? "disappear" : undefined
          }
          onClick={() => {
            setGS((prev) => {
              const next = {
                ...prev,
                mPositions: [...prev.sPositions.slice()],
                isHT: !prev.isHT,
                active: Array(9).fill(false, 2, 9),
                isRollDicePhase: true,
                turn: prev.turn + 1,
                move: 0,
              };
              return next;
            });
          }}
        >
          Pass
        </button>
      </div>
      <div
        className={
          gS.isRollDicePhase ? "in-game-buttons disappear" : "in-game-buttons"
        }
      >
        {choseButtonList}
      </div>
    </div>
  );
};

export default Panel;
