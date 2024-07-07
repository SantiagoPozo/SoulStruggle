const Board = ({ positions, shadowPositions, isHeavenCurrentPlayer }) => {
  const board = [];

  for (let index = 2; index <= 8; index++) {
    board.push(
      <Column
        index={index}
        key={index}
        mainPosition={positions[index]}
        shadowPosition={shadowPositions[index]}
      />
    );
  }

  return (
    <div id="board">
      <div className={isHeavenCurrentPlayer ? "heaven" : "hell"}>{board}</div>
    </div>
  );
};

const Column = ({ index, mainPosition, shadowPosition }) => {
  const size = Math.min(2 * index - 1, 19 - 2 * index);
  // const size = Math.min(2 * index + 5, 25 - 2 * index);
  const Circle = ({ index, type }) => {
    return <div className={"circle" + " " + type} key={index}></div>;
  };

  const circulos = [];

  for (let index = 0; index < size; index++) {
    let type = "heaven";
    index === (size - 1) / 2 && (type = "earth");
    index > (size - 1) / 2 && (type = "hell");
    (index <= 2 || index >= size - 3) && (type += " border");
    circulos.push(<Circle circleNumber={index} key={index} type={type} />);
  }

  return (
    <div className="columna">
      <div id="head" className="label">
        {index}
      </div>{" "}
      {circulos}
      <div id="foot" className="label">
        {index}
      </div>
      <Meeple type="shadow" colNumber={index} position={shadowPosition} />
      <Meeple type="main" colNumber={index} position={mainPosition} />
    </div>
  );
};

const Meeple = (props) => {
  const yCoord =
    (props.type === "main" ? -25 : -10) +
    50 *
      (props.position - 2 - Math.min(props.colNumber - 2, 8 - props.colNumber));
  const xCoord = props.type === "main" ? 15 : 12;
  const className = props.type === "main" ? "main meeple" : "shadow meeple";
  const id =
    props.type === "main" ? `meeple-main` : `meeple-shadow${props.colNumber}`;
  const meepleColor = props.type === "main" ? "#dd0000" : "#444444";
  return (
    <div
      className={className}
      id={id}
      style={{ top: yCoord + "px", left: xCoord + "px", position: "relative" }}
    >
      <MeepleImage fill={meepleColor} />
    </div>
  );
};

const MeepleImage = (props) => {
  return (
    <svg
      width="25px"
      height="25px"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={props.fill}
        stroke="#cc1111"
        d="M256 54.99c-27 0-46.418 14.287-57.633 32.23-10.03 16.047-14.203 34.66-15.017 50.962-30.608 15.135-64.515 30.394-91.815 45.994-14.32 8.183-26.805 16.414-36.203 25.26C45.934 218.28 39 228.24 39 239.99c0 5 2.44 9.075 5.19 12.065 2.754 2.99 6.054 5.312 9.812 7.48 7.515 4.336 16.99 7.95 27.412 11.076 15.483 4.646 32.823 8.1 47.9 9.577-14.996 25.84-34.953 49.574-52.447 72.315C56.65 378.785 39 403.99 39 431.99c0 4-.044 7.123.31 10.26.355 3.137 1.256 7.053 4.41 10.156 3.155 3.104 7.017 3.938 10.163 4.28 3.146.345 6.315.304 10.38.304h111.542c8.097 0 14.026.492 20.125-3.43 6.1-3.92 8.324-9.275 12.67-17.275l.088-.16.08-.166s9.723-19.77 21.324-39.388c5.8-9.808 12.097-19.576 17.574-26.498 2.74-3.46 5.304-6.204 7.15-7.754.564-.472.82-.56 1.184-.76.363.2.62.288 1.184.76 1.846 1.55 4.41 4.294 7.15 7.754 5.477 6.922 11.774 16.69 17.574 26.498 11.6 19.618 21.324 39.387 21.324 39.387l.08.165.088.16c4.346 8 6.55 13.323 12.61 17.254 6.058 3.93 11.974 3.45 19.957 3.45H448c4 0 7.12.043 10.244-.304 3.123-.347 6.998-1.21 10.12-4.332 3.12-3.122 3.984-6.997 4.33-10.12.348-3.122.306-6.244.306-10.244 0-28-17.65-53.205-37.867-79.488-17.493-22.74-37.45-46.474-52.447-72.315 15.077-1.478 32.417-4.93 47.9-9.576 10.422-3.125 19.897-6.74 27.412-11.075 3.758-2.168 7.058-4.49 9.81-7.48 2.753-2.99 5.192-7.065 5.192-12.065 0-11.75-6.934-21.71-16.332-30.554-9.398-8.846-21.883-17.077-36.203-25.26-27.3-15.6-61.207-30.86-91.815-45.994-.814-16.3-4.988-34.915-15.017-50.96C302.418 69.276 283 54.99 256 54.99z"
      />
    </svg>
  );
};

export default Board;
