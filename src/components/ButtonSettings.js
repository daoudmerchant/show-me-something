import { useState, useEffect } from "react";

// components
import Button from "./Button";
import ButtonEditor from "./ButtonEditor";

const ButtonSettings = ({ uid, buttons, setButtons }) => {
  const [currentButtons, setCurrentButtons] = useState(null);
  const [buttonsBeingEdited, setButtonsBeingEdited] = useState(null);

  // Show / hide button editor (reset buttons on hide)
  const toggleButtonEdit = (i) => {
    if (buttonsBeingEdited[i]) {
      setCurrentButtons((prevButtons) => {
        const newButtons = [...prevButtons];
        newButtons[i] = { ...buttons[i] };
        return newButtons;
      });
    }
    setButtonsBeingEdited((prevButtonsBeingEdited) => {
      const newButtonsBeingEdited = [...prevButtonsBeingEdited];
      newButtonsBeingEdited[i] = !prevButtonsBeingEdited[i];
      return newButtonsBeingEdited;
    });
  };

  // Set state on render
  useEffect(() => {
    if (!buttons) return;
    const clonedButtons = buttons.map((button) => ({
      ...button,
      style: { ...button.style },
    }));
    setCurrentButtons(clonedButtons);
    const noButtonsEdited = new Array(buttons.length).fill(false);
    setButtonsBeingEdited(noButtonsEdited);
  }, [buttons]);

  // update current buttons on edit
  const setCurrentButton = (i, value, param, subparam) => {
    console.log(subparam);
    setCurrentButtons((prevButtons) => {
      const newButtons = [...prevButtons];
      if (subparam !== undefined) {
        newButtons[i][param][subparam] = value;
      } else {
        newButtons[i][param] = value;
      }
      return newButtons;
    });
  };

  if (!currentButtons) return <p>Loading your buttons...</p>;

  return (
    <fieldset id="userbuttonsettings">
      <legend>Button settings</legend>
      {currentButtons.map((currentButton, i) => {
        const toggleThisButtonEdit = () => toggleButtonEdit(i);
        return (
          <>
            <Button
              button={currentButton}
              key={`button${currentButton.id}${i}`}
              handleClick={toggleThisButtonEdit}
            />
            {buttonsBeingEdited && buttonsBeingEdited[i] && (
              <ButtonEditor
                key={`editor${currentButton.id}${i}`}
                currentButton={currentButton}
                setCurrentButton={setCurrentButton}
                index={i}
                cancel={toggleThisButtonEdit}
              />
            )}
          </>
        );
      })}
    </fieldset>
  );
};

export default ButtonSettings;
