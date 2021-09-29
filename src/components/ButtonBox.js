import Button from "./Button";
import { useState, useCallback, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

// constants
const breakpoints = [0, 720, 850, 1000, 1200];

const ButtonBox = ({ buttons }) => {
  const [firstButtonIndex, setFirstButtonIndex] = useState(0);
  const [currentButtons, setCurrentButtons] = useState(null);
  const handleButtonRight = () => {
    setFirstButtonIndex(
      firstButtonIndex + 1 < buttons.length ? firstButtonIndex + 1 : 0
    );
  };
  const handleButtonLeft = () => {
    setFirstButtonIndex(
      firstButtonIndex - 1 >= 0 ? firstButtonIndex - 1 : buttons.length - 1
    );
  };

  let breakpointQueries = [];
  // for loop as useMediaQuery cannot be used in callback
  for (let i = 0; i < breakpoints.length; i++) {
    breakpointQueries.push(
      // allow loop at render as allows button count to depend upon breakpoints
      useMediaQuery({ query: `(min-width: ${breakpoints[i]}px)` }) // eslint-disable-line
    );
  }
  const currentBreakpoint = breakpointQueries.indexOf(false);
  const buttonCount =
    currentBreakpoint === -1 ? breakpoints.length : currentBreakpoint;

  useEffect(() => {
    if (!buttons) return;
    if (firstButtonIndex + buttonCount <= buttons.length) {
      setCurrentButtons([...buttons].splice(firstButtonIndex, buttonCount));
      return;
    }
    let startButtons = buttons.slice(firstButtonIndex);
    let endButtons = [...buttons].splice(0, buttonCount - startButtons.length);
    setCurrentButtons([...startButtons, ...endButtons]);
  }, [firstButtonIndex, buttonCount, buttons]);

  return buttons ? (
    <div
      id="buttoncontainer"
      style={{ gridTemplateColumns: `1fr repeat(${buttonCount}, 4fr) 1fr` }}
    >
      <div className="buttonnav left" onClick={handleButtonLeft}>
        ◄
      </div>
      {currentButtons?.map((button) => (
        <Button key={button.id} button={button} />
      ))}
      <div className="buttonnav right" onClick={handleButtonRight}>
        ►
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default ButtonBox;
