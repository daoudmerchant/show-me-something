import { useState, memo, useEffect, useContext } from "react";
import { useMediaQuery } from "react-responsive";

// styles
import "../styles/ButtonBox.min.css";

// constants
import { BREAKPOINTS } from "../constants/variables";

// context
import { RedditPostContext } from "../constants/contexts";

// components
import Loading from "./Loading";
import Button from "./Button";

const ButtonBox = ({ buttons }) => {
  // STATE
  const [firstButtonIndex, setFirstButtonIndex] = useState(0);
  const [currentButtons, setCurrentButtons] = useState(null);
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  // CONTEXT
  const { getNextPost, finishedLists } = useContext(RedditPostContext);

  // reset state on button change
  useEffect(() => {
    setFirstButtonIndex(0);
  }, [buttons]);

  // rerender on window resize
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

  // calculate number of visible buttons based on screen size
  let breakpointQueries = [];
  // for loop as useMediaQuery cannot be used in callback
  for (let i = 0; i < BREAKPOINTS.length; i++) {
    breakpointQueries.push(
      // allow loop at render as allows button count to depend upon breakpoints
      useMediaQuery({ query: `(min-width: ${BREAKPOINTS[i]}px)` }) // eslint-disable-line
    );
  }
  const currentBreakpoint = breakpointQueries.indexOf(false);
  const maxButtonCount =
    currentBreakpoint === -1 ? BREAKPOINTS.length : currentBreakpoint;
  const buttonCount = buttons && Math.min(maxButtonCount, buttons.length);
  const needsNavigation = buttons && buttons.length > buttonCount;

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

  // set state based on button calculation
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
