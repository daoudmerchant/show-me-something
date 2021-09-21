import Button from "./Button";

const ButtonBox = ({ buttons }: { buttons: any }) => {
  return (
    <div>
      Box of Buttons
      {/*
      // @ts-ignore */}
      {buttons.map((button) => (
        <Button button={button} />
      ))}
    </div>
  );
};

export default ButtonBox;
