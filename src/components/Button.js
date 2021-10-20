const Button = ({ button, isDisabled, handleClick }) => {
  const style = {
    ...button.style,
    fontFamily: `'${button.style.font}', Verdana, sans-serif`,
  };
  return (
    <button style={style} disabled={isDisabled} onClick={handleClick}>
      {button.text || "..."}
    </button>
  );
};

export default Button;
