import Button from "./Button";

const ButtonBox = ({ buttons }) => {
  return (
    <div>
      Box of Buttons
      {buttons ? (
        buttons.map((button) => <Button key={button.id} button={button} />)
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
};

export default ButtonBox;
