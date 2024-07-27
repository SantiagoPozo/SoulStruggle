import React, { useState } from "react";
import { useGameContext } from "./GameContext";
import { LostTurn, DiceCase, Dado } from "./Tools";

const rollDx = (x) => Math.floor(x * Math.random() + 1);
//Math.random devuelve un valor en [0, 1)

/***********************************
 ******   Bton. A component.
 **********************************/
const Bton = ({ o1 = false, o2 = false, children, disabled }) => {
  const { setGS, advanceShadows } = useGameContext();

  return (
    <button
      className={"option-button"}
      onClick={() => advanceShadows(o1, o2)}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default function Fanel() {
  const { gS, setGS, advanceShadows } = useGameContext();

  const [d, setDados] = useState([0, 0, 0, 0]);
  const roll4Dice = () =>
    setDados([rollDx(4), rollDx(4), rollDx(4), rollDx(4)]);

  const isActiveColumn = gS.active; // Array. From 2 to 9 shows true or false

  const areEquivalents = (arr, brr) => {
    // Compare options
    if (arr[0] === brr[0] && arr[1] === brr[1]) return true;
    if (arr[0] === brr[1] && arr[1] === brr[0]) return true;
    return false;
  };

  // constructions of optiones.
  // every options contein addition 1, adition 2, dice 1, dice 2, dice 3, dice 4.

  const op1 = [d[0] + d[1], d[2] + d[3], d[0], d[1], d[2], d[3]];
  const options = [op1];
  const op2 = [d[0] + d[2], d[1] + d[3], d[0], d[2], d[1], d[3]];
  !areEquivalents(op1, op2) && options.push(op2);
  const op3 = [d[0] + d[3], d[1] + d[2], d[0], d[3], d[1], d[2]];
  !areEquivalents(op1, op3) && !areEquivalents(op2, op3) && options.push(op3);

  const num = isActiveColumn.filter((item) => item === true).length; // number of active columns

  const distToEnd = (x) => {
    const last = [undefined, undefined, 2, 4, 6, 8, 6, 4, 2];
    const t = gS.isHT;
    const dist = t ? last[x] - gS.sPositions[x] : last[x] + gS.sPositions[x];
    return dist;
  };

  const newOptions = [];

  /*******************************
   *  Feeding choseButtonList
   *******************************/
  let index = 0,
    areThereValidOptions = false;

  options.forEach((o) => {
    const [a, b, c, d, e, f] = [o[0], o[1], o[2], o[3], o[4], o[5]];
    console.log("************ COMBINATION:", a, ",", b, " ***************");

    /*     const aCanTake1Step = distToEnd(a) >= 1 ? true : false;
    const aCanTake2Steps = distToEnd(a) >= 2 ? true : false;
    const bCanTake1Step = distToEnd(b) >= 1; */
    const isHT = gS.isHT;
    const aDist = distToEnd(a),
      bDist = distToEnd(b);
    const aIsActv = isActiveColumn[a],
      bIsActv = isActiveColumn[b];

    console.log(
      `a = ${a} -> aDist ${aDist} || b = ${b} -> bDist ${bDist} || a = ${a}: aIsActv ${aIsActv} || b = ${b}: bIsActv ${bIsActv}, || num ${num} `
    );

    /***********************
     * a === b
     **********************/
    if (a === b) {
      console.log("Inside a === b");

      //Case 0
      if (aDist === 0 || (aDist >= 1 && num === 2 && !aIsActv)) {
        console.log(
          `Dentro de (aDist === 0 || (aDist >= 1 && num === 2 && !aIsActv))`
        );
        // fail
        index++;
        const op = (
          <div className="option-div" key={`option-${index}`}>
            <DiceCase
              key={`case-${index}`}
              clave={`case-${index}`}
              fourNumberArray={[c, d, e, f]}
            />
            <div className="message">
              <p>Soul #{a} can't advance!</p>
            </div>
          </div>
        );
        newOptions.push(op);
      }

      // case 1
      if (aDist === 1 && (num <= 1 || aIsActv)) {
        console.log("Case1: inside 'aDist === 1 && (num <= 1 || aIsActv)'");
        // a available for a step.
        const message = isHT
          ? `Soul #${a} ascends a level`
          : `Soul #${a} descends a level into a deepest dimension of fun`;

        index++;
        const op = (
          <div
            className="option-div like-a-button"
            onClick={() => advanceShadows(a)}
            key={`option-${index}`}
          >
            <DiceCase
              key={`case-${index}`}
              clave={`case-${index}`}
              fourNumberArray={[c, d, e, f]}
            />
            <div className="message">
              <p>{message} </p>
            </div>
          </div>
        );
        newOptions.push(op);
        areThereValidOptions = true;
      }

      // case 2
      if (aDist >= 2 && (num <= 1 || aIsActv)) {
        console.log("Inside case 2: '(aDist >= 2 && (num <= 1 || aIsActv))' ");
        // a available for 2 steps
        const message = isHT
          ? `Soul #${a} ascends •• levels`
          : `Soul #${a} descends •• levels`;

        index++;
        const op = (
          <div
            className="option-div like-a-button"
            onClick={() => advanceShadows(a, a)}
            key={`option-${index}`}
          >
            <DiceCase
              key={`case-${index}`}
              clave={`case-${index}`}
              fourNumberArray={[c, d, e, f]}
            />
            <div className="message">{message}</div>
          </div>
        );
        newOptions.push(op);
        areThereValidOptions = true;
      }
    }

    if (a !== b) {
      /***************************
       ********  a !== b  ********
       ***************************/
      console.log("Inside a !== b");

      // Case 3. Fail.
      if (
        (aDist === 0 && bDist === 0) ||
        (aDist === 0 && bDist >= 1 && !bIsActv && num >= 2) ||
        (aDist >= 1 && bDist === 0 && !aIsActv && num >= 2) ||
        (aDist >= 1 && bDist >= 1 && !aIsActv && !bIsActv && num === 2)
      ) {
        console.log(`Inside case 3 (fail): (
        (aDist === 0 && bDist === 0) ||
        (aDist === 0 && bDist >= 1 && !bIsActv && num >= 2) ||
        (aDist >= 1 && bDist === 0 && !aIsActv && num >= 2) ||
        (aDist >= 1 && bDist >= 1 && !aIsActv && !bIsActv && num === 2)
      )`);
        const message = "I will let repose these souls...";
        index++;
        const op = (
          <div className="option-div" key={`option-${index}`}>
            <DiceCase
              key={`case-${index}`}
              clave={`case-${index}`}
              fourNumberArray={[c, d, e, f]}
            />
            <div className="message">
              <p>
                <div key={`bton-${index}`}>{message}</div>
              </p>
            </div>
          </div>
        );
        newOptions.push(op);
      }

      // Case 4: only a member moves. Context decides.
      if (
        (aDist === 0 && bDist > 0 && (bIsActv || (!bIsActv && num < 2))) ||
        (aDist > 0 && bDist === 0 && (aIsActv || (!aIsActv && num < 2))) ||
        (aDist > 0 && bDist > 0 && num === 2 && aIsActv ^ bIsActv)
      ) {
        console.log("Inside case 4");
        let candidate = false;
        aIsActv && aDist !== 0 && (candidate = a);
        bIsActv && bDist !== 0 && (candidate = b);
        if (!candidate) {
          aDist > 0 && (candidate = a);
          bDist > 0 && (candidate = b);
        }

        const message = isHT
          ? `Salvation can be a step closer but only for #${candidate}`
          : `A little bit of fun only for #${candidate}`;
        index++;
        const op = (
          <div className="option-div" key={`option-${index}`}>
            <DiceCase
              key={`case-${index}`}
              clave={`case-${index}`}
              whoIsCandidate={candidate}
              fourNumberArray={[c, d, e, f]}
            />
            <div className="message">
              <p>{message} </p>
            </div>
          </div>
        );
        newOptions.push(op);
        areThereValidOptions = true;
      }

      // Case 5
      if (aDist * bDist > 0 && num === 1 && !aIsActv && !bIsActv) {
        // chose a soul
        console.log("Inside case 5. Choose a soul");

        const message = isHT
          ? "Only one of them goes to church..."
          : "Which of these made some funny things?";

        index++;
        const op = (
          <div className="option-div" key={`option-${index}`}>
            <DiceCase fourNumberArray={[c, d, e, f]} fun={true} />
            <div className="question"> {message} </div>
          </div>
        );
        newOptions.push(op);
        areThereValidOptions = true;
      }

      // case 6
      if (
        aDist * bDist > 0 &&
        (num === 0 || (aIsActv && bIsActv) || (aIsActv ^ bIsActv && num === 1))
      ) {
        console.log(
          "Inside case 6. Both. ",
          "aDist * bDist > 0 && (num === 0 || (aIsActv && bIsActv) || (aIsActv ^ bIsActv && num === 1))"
        );
        const message = isHT
          ? `#${a} and ${b} deserve to go to heaven`
          : `Damnation for #${a} and #${b}`;
        index++;
        const op = (
          <div
            className="option-div like-a-button"
            onClick={() => advanceShadows(a, b)}
            key={`option-${index}`}
          >
            <DiceCase
              key={`case-${index}`}
              clave={`case-${index}`}
              fourNumberArray={[c, d, e, f]}
            />
            <div className="message">
              <p>{message} </p>
            </div>
          </div>
        );
        newOptions.push(op);
        areThereValidOptions = true;
      }
    }
  });

  console.log("areThereValidOptions: ", areThereValidOptions);

  if (!areThereValidOptions) newOptions.push(<LostTurn key="lost" />);

  if (gS.isRollDicePhase) {
    return (
      <div id="panel" className={gS.isHT ? "heaven" : "hell"}>
        <div id="dadum">
          <Dado id="dado0" key="dado0" number={d[0]} />
          <Dado id="dado1" key="dado1" number={d[1]} />
          <Dado id="dado2" key="dado2" number={d[2]} />
          <Dado id="dado3" key="dado3" number={d[3]} />
        </div>

        <div className="in-game-buttons">
          <button
            id="roll-button"
            className={!gS.isRollDicePhase ? "disappear" : undefined}
            onClick={() => {
              roll4Dice();
              document.getElementById("dadum").classList.toggle("par");

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
            className={gS.move === 0 ? "disappear" : undefined}
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
      </div>
    );
  } else {
    return (
      <div id="panel" className={gS.isHT ? "heaven" : "hell"}>
        <div id="dadum">
          <Dado id="dado0" key="dado0" number={d[0]} />
          <Dado id="dado1" key="dado1" number={d[1]} />
          <Dado id="dado2" key="dado2" number={d[2]} />
          <Dado id="dado3" key="dado3" number={d[3]} />
        </div>

        <div id="show">{newOptions}</div>
      </div>
    );
  }
}
