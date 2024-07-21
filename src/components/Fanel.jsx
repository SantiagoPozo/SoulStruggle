import { useState } from "react";

const rollDx = (x) => Math.floor(x * Math.random() + 1);
//Math.random devuelve un valor en [0, 1)

const randomFace = () => {
  const f = ["🙁", "😕", "😢", "😖", "😱", "😤", "😠", "🤬", "😓"];
  return f[Math.floor(9 * Math.random())];
};

const Fado = (props) => (
  <div id={props.id} className={"dado " + props.className}>
    <div>{props.result}</div>
  </div>
);

const Boton = () => <button></button>;

const Combinacion = (objeto) => {
  //   // Recibe objeto
  //   const objeto = {
  //     comb: [
  //       {
  //         dados: { a, b },
  //         suma: a + b,
  //         available: true,
  //       },
  //       {
  //         dados: { c, d },
  //         suma: c + d,
  //         available: true,
  //       },
  //     ],
  //     compatibilidad: true,
  // };
  const d1 = objeto.comb[0].dados.a;
  const d2 = objeto.comb[0].dados.b;
  const d3 = objeto.comb[1].dados.c;
  const d4 = objeto.comb[2].dados.d;
  const av1 = objeto.comb[0].available;
  const av2 = objeto.comb[1].available;
  const cmp = objeto.compatibilidad;

  const opciones = [];
  av1 &&
    av2 &&
    cmp &&
    opciones.push(<Boton key="0" semilla={[d1 + d2, d3 + d4]} />);

  if (av1 && av2 && !cmp) {
    opciones.push(<Boton key="0" semilla={d1 + d2} />);
    opciones.push(<Boton key="1" semilla={d3 + d3} />);
  }
  av1 && !av2 && opciones.push(<Boton key="0" semilla={d1 + d2} />);
  !av1 && av2 && opciones.push(<Boton key="0" semilla={d3 + d4} />);
  !av1 && av2 && opciones.push(<Boton key="0" />);

  return;
  <div className="dice-case">
    <div id="first-pair" className="pair">
      <Fado key="0" number={d1} />
      <Fado key="1" number={d2} />
    </div>{" "}
    &
    <div id="second-pair" className="pair">
      <Fado key="0" number={d3} />
      <Fado key="1" number={d4} />
    </div>
    <div>{opciones}</div>
  </div>;
};
