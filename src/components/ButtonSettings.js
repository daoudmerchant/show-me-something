import { useState, useEffect } from "react";

// components
import Button from "./Button";
import ButtonEditor from "./ButtonEditor";

const ButtonSettings = ({ buttons }) => {
  const [currentButtons, setCurrentButtons] = useState(null);
  const [buttonsBeingEdited, setButtonsBeingEdited] = useState(null);

  const resetButton = (i) => {
    setCurrentButtons((prevButtons) => {
      const newButtons = [...prevButtons];
      newButtons[i] = buttons[i];
      return newButtons;
    });
  };

  useEffect(() => {
    if (!buttons) return;
    setCurrentButtons(buttons);
    let noButtonsEdited = new Array(buttons.length).fill(false);
    setButtonsBeingEdited(noButtonsEdited);
  }, [buttons]);

  const setCurrentButton = (i, param, value) => {
    setCurrentButtons((prevButtons) => {
      const newButtons = [...prevButtons];
      newButtons[i][param] = value;
      return newButtons;
    });
  };
  if (!currentButtons) return <p>Loading your buttons...</p>;

  return (
    <fieldset id="userbuttonsettings">
      <legend>Button settings</legend>
      {currentButtons.map((currentButton, i) => {
        return (
          <>
            <Button
              button={currentButton}
              key={currentButton.id}
              handleClick={() => {
                setButtonsBeingEdited((prevButtonsBeingEdited) => {
                  const newButtonsBeingEdited = [...prevButtonsBeingEdited];
                  newButtonsBeingEdited[i] = !prevButtonsBeingEdited[i];
                  return newButtonsBeingEdited;
                });
              }}
            />
            <ButtonEditor
              currentButton={currentButton}
              setCurrentButton={setCurrentButton}
              resetButton={resetButton}
              index={i}
              visible={buttonsBeingEdited[i]}
            />
          </>
        );
      })}
    </fieldset>
  );
};

export default ButtonSettings;
