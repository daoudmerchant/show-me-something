import { useState, memo, useEffect, useContext } from "react";
import { useMediaQuery } from "react-responsive";
import { RedditPostContext } from "../constants/contexts";

import "../styles/ButtonBox.css";

// components
import Loading from "./Loading";
import Button from "./Button";

// constants
// TODO: Adjust and increase breakpoints
const breakpoints = [0, 720, 850, 1000, 1200, 1400];

const ButtonBox = ({ buttons }) => {
  const [firstButtonIndex, setFirstButtonIndex] = useState(0);
  const [currentButtons, setCurrentButtons] = useState(null);
  // handle window resize
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { getNextPost, finishedLists } = useContext(RedditPostContext);

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
  const maxButtonCount =
    currentBreakpoint === -1 ? breakpoints.length : currentBreakpoint;

  const buttonCount = buttons && Math.min(maxButtonCount, buttons.length);

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
    if (buttons === undefined) return;
    if (buttons === null) return <p>Oops no buttons!</p>;
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
      id="buttonbox"
      key={`${dimensions.width}x${dimensions.height}`}
      style={{
        gridTemplateColumns: `${
          needsNavigation ? "1fr " : ""
        }repeat(${buttonCount}, 4fr)${needsNavigation ? " 1fr" : ""}`,
      }}
    >
      {needsNavigation && (
        <button
          type="button"
          className="buttonnav left"
          onClick={handleButtonLeft}
        >
          ◄
        </button>
      )}
      {currentButtons?.map((button, i) => (
        <Button
          key={`button${button.id}${i}`}
          button={button}
          isDisabled={finishedLists[button.text]}
          handleClick={() => {
            getNextPost({
              subreddits: button.subreddits,
              category: button.text,
            });
          }}
        />
      ))}
      {needsNavigation && (
        <button
          type="button"
          className="buttonnav right"
          onClick={handleButtonRight}
        >
          ►
        </button>
      )}
    </div>
  ) : (
    <Loading type="BUTTONS" />
  );
};

export default memo(ButtonBox);
