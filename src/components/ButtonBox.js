import Button from "./Button";

const ButtonBox = ({ buttons }) => {
  return (
    <div id="buttonContainer">
      {buttons ? (
        buttons.map((button) => <Button key={button.id} button={button} />)
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
};

export default ButtonBox;
