// styles
import "../styles/Button.css";

const Button = ({ button, isDisabled, handleClick }) => {
  const style = {
    ...button.style,
    fontFamily: `"${button.style.font}", Verdana, sans-serif`,
    borderColor: `${button.style.backgroundColor}`,
    background: `radial-gradient(ellipse at center, ${button.style.backgroundColor}, ${button.style.backgroundColor} 20%, #fff 80%, #fff 100%)`,
  };
  return (
    <div className="buttoncontainer">
      <button
        type="button"
        style={style}
        disabled={isDisabled}
        onClick={handleClick}
      >
        {button.text || "..."}
      </button>
    </div>
  );
};

export default Button;
