import React, { useState } from "react";
import { useGameContext } from "./GameContext";
import { LostTurn, DiceCase, Dado } from "./Tools";

const rollDx = (x) => Math.floor(x * Math.random() + 1);
//Math.random devuelve un valor en [0, 1)

const randomFace = () => {
  const f = ["🙁", "😕", "😢", "😖", "😱", "😤", "😠", "🤬", "😓", "😐"];
  return f[Math.floor(f.length * Math.random())];
};

/***********************************
 ******   OptionDiv. A component
 **********************************/
const OptionDiv = ({ array }) => {
  const { gS, setGS } = useGameContext();

  const [o1, o2, d1, d2, d3, d4] = array;

  return (
    <div className="origin">
      <div className="dice-case">
        <div id="first-pair" className="pair">
          <Dado key="0" number={d1} />
          <Dado key="1" number={d2} />
        </div>{" "}
        <div id="second-pair" className="pair">
          <Dado key="2" number={d3} />
          <Dado key="3" number={d4} />
        </div>
      </div>
      <Bton key="0" o1={o1} o2={o2} />
    </div>
  );
};

/***********************************
 ******   Bton. A component.
 **********************************/
const Bton = ({ o1, o2, children, disabled }) => {
  const { gS, setGS } = useGameContext();
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

  return (
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
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default function Fanel() {
  const { gS, setGS } = useGameContext();

  const [d, setDados] = useState([0, 0, 0, 0]);
  const roll4Dice = () =>
    setDados([rollDx(4), rollDx(4), rollDx(4), rollDx(4)]);

  // setDados([1, 1, 1, 1]);

  const isActiveColumn = gS.active; // Array. From 2 to 9 shows true or false

  const options = [
    [d[0] + d[1], d[2] + d[3], d[0], d[1], d[2], d[3]],
    [d[0] + d[2], d[1] + d[3], d[0], d[2], d[1], d[3]],
    [d[0] + d[3], d[1] + d[2], d[0], d[3], d[1], d[2]],
  ];

  let numOfActiveCols = isActiveColumn.filter((item) => item === true).length;

  const isXColAvailable = (x) => {
    // Evaluate col x

    const last = [undefined, undefined, 2, 4, 6, 8, 6, 4, 2];
    const NTLast = [undefined, undefined, 1, 3, 5, 7, 5, 3, 1];
    const isHT = gS.isHT;

    const shadowIsLast =
      (isHT && gS.sPositions[x] === last[x]) ||
      (!isHT && gS.sPositions[x] === -last[x]);
    // console.log("Está shadow al final?: ", shadowIsLast);

    const shadowIsNextToLast =
      (isHT && gS.sPositions[x] === NTLast[x]) ||
      (!isHT && gS.sPositions[x] === -NTLast[x]);

    const answer = [!shadowIsLast, !shadowIsLast && !shadowIsNextToLast];
    // answer returns
    // [0] » x col is available for 1 step ? (true or false)
    // [1] » x col is available for 2 steps? (true or false)

    return answer;
  };

  const newOptions = [];

  /*******************************
   *  Feeding choseButtonList
   *******************************/
  let kei = 0,
    areThereValidOptions = false;

  options.forEach((option) => {
    const [a, b] = [option[0], option[1]];
    const p = gS.isHT;
    const aFor1Step = isXColAvailable(a, p)[0];
    const aFor2Steps = isXColAvailable(a, p)[1];
    const bFor1Step = isXColAvailable(b, p)[0];

    // A NEW DIRECTION //
    const [c, d, e, f] = [option[2], option[3], option[4], option[5]];

    if (a === b) {
      if (
        numOfActiveCols <= 1 ||
        (numOfActiveCols === 2 && isActiveColumn[a])
      ) {
        if (aFor2Steps) {
          const op = (
            <div key={kei} className="origin">
              <DiceCase fourNumberArray={[c, d, e, f]} />
              <div className="one-button">
                <Bton key={kei} o1={a} o2={b}>
                  2x Avanza en {a}
                </Bton>
              </div>
            </div>
          );
          newOptions.push(op);
          kei++;
          areThereValidOptions = true;
        }

        if (aFor1Step && !aFor2Steps) {
          const op = (
            <div key={kei} className="origin">
              <DiceCase fourNumberArray={[c, d, e, f]} />
              <div className="one-button">
                <Bton key={kei} o1={a}>
                  Avanza en {a}
                </Bton>
              </div>
            </div>
          );
          newOptions.push(op);
          kei++;
          areThereValidOptions = true;

          if (!aFor1Step) {
            // fail
            const op = (
              <div key={kei} className="origin">
                <DiceCase fourNumberArray={[c, d, e, f]} />
                <div class="one-button">
                  <Bton key="0" o1={a} o2={b} disabled={true}>
                    Nada por aquí
                  </Bton>
                </div>
              </div>
            );
            newOptions.push(op);
            kei++;
          }
        } else {
          // fail
          const op = (
            <div key={kei} className="origin">
              <DiceCase fourNumberArray={[c, d, e, f]} />
              <div class="one-button">
                <Bton key="0" o1={a} o2={b} disabled={true}>
                  Nada por aquí
                </Bton>
              </div>
            </div>
          );
          newOptions.push(op);
          kei++;
        }
      }
    } else {
      // a != b
      if (
        numOfActiveCols === 0 ||
        (numOfActiveCols === 1 && (isActiveColumn[a] || isActiveColumn[b])) ||
        (numOfActiveCols === 2 && isActiveColumn[a] && isActiveColumn[b])
      ) {
        if (aFor1Step && bFor1Step) {
          const op = (
            <div key={kei} className="origin">
              <DiceCase fourNumberArray={[c, d, e, f]} />
              <div className="one-button">
                <Bton o1={a} o2={b}>
                  {" "}
                  Avanza en {a} y {b}{" "}
                </Bton>
              </div>
            </div>
          );
          newOptions.push(op);
          kei++;
          areThereValidOptions = true;
        }
        if (aFor1Step + bFor1Step == 1) {
          let ta = a,
            be = b;
          if (bFor1Step) {
            ta = b;
            be = false;
          }
          const op = (
            <div key={kei} className="origin">
              <DiceCase fourNumberArray={[c, d, e, f]} />
              <div className="one-button">
                <Bton o1={ta} o2={be}>
                  {" "}
                  Avanza solo en {ta}
                </Bton>
              </div>
            </div>
          );
          newOptions.push(op);
          kei++;
          areThereValidOptions = true;
        }
      }

      if (numOfActiveCols === 1 && !isActiveColumn[a] && !isActiveColumn[b]) {
        const op = (
          <div key={kei} className="origin">
            {/* change origin form option if possible */}
            <DiceCase fourNumberArray={[c, d, e, f]} />
            <div class="two-buttons">
              <Bton key={0} o1={a} o2={false}>
                {" "}
                Avanza en {a}{" "}
              </Bton>
              <Bton key={1} o1={b} o2={false}>
                {" "}
                Avanza en {b}{" "}
              </Bton>
            </div>
          </div>
        );
        newOptions.push(op);
        kei++;
        areThereValidOptions = true;
      }

      if (
        numOfActiveCols === 2 &&
        ((isActiveColumn[a] && !isActiveColumn[b]) ||
          (!isActiveColumn[a] && isActiveColumn[b]))
      ) {
        let ta = a,
          be = b;
        if (isActiveColumn[b]) {
          ta = b;
          be = false;
        }

        const op = (
          <div key={kei} className="origin">
            <DiceCase fourNumberArray={[c, d, e, f]} />
            <div class="one-button">
              <Bton key={0} o1={ta} o2={be}>
                {" "}
                Avanza en {ta}{" "}
              </Bton>
            </div>
          </div>
        );
        newOptions.push(op);
        kei++;
        areThereValidOptions = true;
      }

      if (numOfActiveCols === 2 && !isActiveColumn[a] && !isActiveColumn[b]) {
        const op = (
          <div key={kei} className="origin">
            <DiceCase fourNumberArray={[c, d, e, f]} />
            <div class="one-button">
              <Bton key="0" o1={a} o2={b} disabled={true}>
                Nada por aquí {randomFace()}
              </Bton>
            </div>
          </div>
        );
        newOptions.push(op);
        kei++;
      }
    }
    console.log("areThereValidOptions: ", areThereValidOptions);
    if (!areThereValidOptions) newOptions.push(LostTurn);
  });

  const par = gS.move % 4 ? "par" : undefined;

  return (
    <div id="panel" className={gS.isHT ? "heaven" : "hell"}>
      <div id="dadum">
        <Dado id="dado0" className={par} key={"0"} number={d[0]} />
        <Dado id="dado1" className={par} key={"1"} number={d[1]} />
        <Dado id="dado2" className={par} key={"2"} number={d[2]} />
        <Dado id="dado3" className={par} key={"3"} number={d[3]} />
      </div>

      <div className="in-game-buttons">
        <button
          id="roll-button"
          className={!gS.isRollDicePhase ? "disappear" : undefined}
          onClick={() => {
            roll4Dice();
            setGS((prv) => ({
              ...prv,
              roll: d,
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
        <div id="show">{newOptions}</div>
      </div>
    </div>
  );
}
