import { useState, useEffect } from "react";

// utils
import { getNewButtons } from "../utils";

// components
import Button from "./Button";
import ButtonEditor from "./ButtonEditor";

const DEFAULT_BUTTON = {
  text: "Add New Button...",
  style: {
    color: "#000000",
    backgroundColor: "#FFFFFF",
    font: "",
  },
  subreddits: [],
};

const ButtonSettings = ({ uid, buttons, setButtons }) => {
  const [currentButtons, setCurrentButtons] = useState(null);
  const [buttonsBeingEdited, setButtonsBeingEdited] = useState(null);

  // Show / hide button editor (reset buttons on hide)
  const toggleButtonEdit = (i) => {
    if (buttonsBeingEdited[i]) {
      // closing editor, cancelling edit
      setCurrentButtons((prevButtons) => {
        let newButtons = getNewButtons(prevButtons);
        if (i === buttons.length) {
          // new button cancelled
          newButtons[prevButtons.length - 1] = { ...DEFAULT_BUTTON };
        } else {
          // cancelled edit to existing buttons
          newButtons[i] = { ...buttons[i] };
        }
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
    const clonedButtons = [...getNewButtons(buttons), { ...DEFAULT_BUTTON }];
    setCurrentButtons(clonedButtons);
    const noButtonsEdited = new Array(buttons.length).fill(false);
    setButtonsBeingEdited(noButtonsEdited);
  }, [buttons]);

  // update current buttons on edit
  const editCurrentButton = (buttonIndex, value, param, subparam) => {
    setCurrentButtons((prevButtons) => {
      let newButtons = getNewButtons(prevButtons);
      console.log(newButtons);
      if (subparam !== undefined) {
        newButtons[buttonIndex][param][subparam] = value;
      } else {
        newButtons[buttonIndex][param] = value;
      }
      console.log(newButtons);
      return newButtons;
    });
  };

  const deleteCurrentButtonSubreddit = (buttonIndex, deletedSubreddit) => {
    setCurrentButtons((prevButtons) => {
      let newButtons = getNewButtons(prevButtons);
      newButtons[buttonIndex].subreddits = newButtons[
        buttonIndex
      ].subreddits.filter((subreddit) => subreddit !== deletedSubreddit);
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
            {currentButton.text !== DEFAULT_BUTTON.text && (
              <button
                type="button"
                onClick={() => {
                  if (
                    // A confirm box will do for now
                    //eslint-disable-next-line
                    confirm(
                      `Are you sure you want to delete ${
                        currentButton.text || "this button"
                      }?`
                    )
                  ) {
                    // TODO: Handle delete button
                  }
                }}
              >
                Delete
              </button>
            )}
            <Button
              button={currentButton}
              key={`button${currentButton.id}${i}`}
              handleClick={toggleThisButtonEdit}
            />
            {buttonsBeingEdited && buttonsBeingEdited[i] && (
              <ButtonEditor
                key={`editor${currentButton.id}${i}`}
                currentButton={currentButton}
                editCurrentButton={editCurrentButton}
                deleteCurrentButtonSubreddit={deleteCurrentButtonSubreddit}
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
