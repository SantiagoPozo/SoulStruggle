function Title() {
  return (
    <header>
      <h1>Soul Struggle</h1>
      <h2>
        A push-your-luck game for two players strongly based on Can't Stop.
      </h2>
      <p>Get three souls for your team and win.</p>
    </header>
  );
}

const StartButton = ({ ini }) => {
  return (
    <button id="start" onClick={ini}>
      Start!
    </button>
  );
};

export default function Inicio({ ini }) {
  return (
    <>
      <Title />
      <StartButton ini={ini} />
    </>
  );
}
