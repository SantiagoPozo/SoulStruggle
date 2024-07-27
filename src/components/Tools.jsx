import { useContext } from "react";
import { useGameContext } from "./GameContext";

const randomFace = () => {
  const f = ["🙁", "😕", "😢", "😖", "😱", "😤", "😠", "😓", "😐"];
  return f[Math.floor(f.length * Math.random())];
};

/*************************
 *****   Lost Turn  ******
 *************************/
const LostTurn = () => {
  const { gS, setGS } = useGameContext();
  return (
    <button
      id="lost-button"
      onClick={() => {
        setGS((prev) => {
          const next = {
            ...prev,
            sPositions: [...prev.mPositions.slice()],
            isHT: !prev.isHT,
            active: Array(9).fill(false, 2, 9),
            isRollDicePhase: true,
            move: 0,
          };
          return next;
        });
      }}
    >
      {randomFace()} Lost turn! {randomFace()}
    </button>
  );
};

const Dado = (props) => (
  <div id={props.id} className={"dado " + props.className}>
    <div>{props.number}</div>
  </div>
);

const DiceCase = ({
  fourNumberArray,
  clave,
  fun = false,
  whoIsCandidate = false,
}) => {
  const { advanceShadows } = useGameContext();
  const [c, d, e, f] = fourNumberArray;

  return (
    <div className="dice-case">
      <div
        id="first-pair"
        className={
          fun || whoIsCandidate === c + d ? "pair like-a-button" : "pair"
        }
        onClick={() => {
          (fun || whoIsCandidate === c + d) && advanceShadows(c + d);
        }}
      >
        <Dado key={`${clave}dado0`} number={c} />
        <Dado key={`${clave}dado1`} number={d} />
      </div>
      <div>&</div>
      <div
        id="second-pair"
        className={
          fun || whoIsCandidate === e + f ? "pair like-a-button" : "pair"
        }
        onClick={() => {
          (fun || whoIsCandidate === e + f) && advanceShadows(e + f);
        }}
      >
        <Dado key={`${clave}dado2`} number={e} />
        <Dado key={`${clave}dado3`} number={f} />
      </div>
      <div className="braces">
        <div className="brace">{c + d} </div>
        <div> </div>
        <div className="brace">{e + f}</div>
      </div>
    </div>
  );
};
export { LostTurn, Dado, DiceCase };
