import Button from "./Button";

const ButtonBox = ({ buttons }) => {
  return (
    <div>
      Box of Buttons
      {buttons.map((button) => (
        <Button button={button} />
      ))}
    </div>
  );
};

export default ButtonBox;
