import Button from "./Button";
import { useState, memo, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

// constants
// TODO: Adjust and increase breakpoints
const breakpoints = [0, 720, 850, 1000, 1200, 1400];

const ButtonBox = ({ buttons }) => {
  const [firstButtonIndex, setFirstButtonIndex] = useState(0);
  const [currentButtons, setCurrentButtons] = useState(null);

  const handleButtonRight = () => {
    setFirstButtonIndex(
      (firstButtonIndex + currentButtons.length) % buttons.length
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
  // TODO: Fix repeating buttons on fewer than breakpoints
  const buttonCount =
    currentBreakpoint === -1 ? breakpoints.length : currentBreakpoint;

  /*
    TODO: Replace with %-based solution, e.g.

    const currentButtons = (() => {
      let buttonArray = [];
      for (let i = firstButtonIndex; i < buttonCount; i++) {
        buttonArray[i] = buttons[firstButtonIndex + i % buttons.length]
      }
      return buttonArray;
    })
  */
  const needsNavigation = buttons && buttons.length > buttonCount;

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

  useEffect(() => {
    setFirstButtonIndex(0);
  }, [buttons]);

  return buttons ? (
    <div
      id="buttoncontainer"
      style={{
        gridTemplateColumns: `${
          needsNavigation ? "1fr " : ""
        }repeat(${buttonCount}, 4fr)${needsNavigation ? " 1fr" : ""}`,
      }}
    >
      {needsNavigation && (
        <div className="buttonnav left" onClick={handleButtonLeft}>
          ◄
        </div>
      )}
      {currentButtons?.map((button) => (
        <Button key={button.id} button={button} />
      ))}
      {needsNavigation && (
        <div className="buttonnav right" onClick={handleButtonRight}>
          ►
        </div>
      )}
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default memo(ButtonBox);
