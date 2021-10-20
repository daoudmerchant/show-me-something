import { useState, useEffect, useCallback } from "react";
import { useMediaQuery } from "react-responsive";
import _ from "lodash";

// API
import { updateData } from "../API/firebase/firebase";

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
  id: false,
};

const ButtonSettings = ({ uid, buttons, setButtons }) => {
  const [referenceButtons, setReferenceButtons] = useState(null);
  const [currentButtons, setCurrentButtons] = useState(null);
  const [buttonsBeingEdited, setButtonsBeingEdited] = useState(null);
  const [buttonValidity, setButtonValidity] = useState(null);

  // media query
  const isTouchscreen = useMediaQuery({ query: "(hover: none)" });

  // Set state on render
  useEffect(() => {
    if (!buttons) return;
    const clonedButtons = _.cloneDeep(buttons);
    setReferenceButtons(buttons);
    const firstCurrentButtons = [...clonedButtons, { ...DEFAULT_BUTTON }];
    setCurrentButtons(firstCurrentButtons);
    const falseArray = new Array(buttons.length).fill(false);
    setButtonsBeingEdited(falseArray);
    setButtonValidity(falseArray);
  }, [buttons]);

  // Show / hide button editor
  const toggleButtonBeingEdited = (i) => {
    setButtonsBeingEdited((prevButtonsBeingEdited) => {
      let newButtonsBeingEdited = [...prevButtonsBeingEdited];
      newButtonsBeingEdited[i] = !prevButtonsBeingEdited[i];
      return newButtonsBeingEdited;
    });
  };

  // Toggle button edit (reset buttons on hide)
  const toggleButtonEdit = (i) => {
    if (buttonsBeingEdited[i]) {
      // closing editor, cancelling edit
      setCurrentButtons((prevButtons) => {
        let newButtons = _.cloneDeep(prevButtons);
        if (i === buttons.length) {
          // new button cancelled
          newButtons[prevButtons.length - 1] = { ...DEFAULT_BUTTON };
        } else {
          // cancelled edit to existing buttons
          newButtons[i] = { ...referenceButtons[i] };
        }
        return newButtons;
      });
    }
    toggleButtonBeingEdited(i);
  };

  // update current buttons on edit
  const editCurrentButton = (buttonIndex, value, param, subparam) => {
    setCurrentButtons((prevButtons) => {
      let newButtons = _.cloneDeep(prevButtons);
      if (subparam !== undefined) {
        newButtons[buttonIndex][param][subparam] = value;
      } else {
        newButtons[buttonIndex][param] = value;
      }
      return newButtons;
    });
  };

  const deleteCurrentButtonSubreddit = (buttonIndex, deletedSubreddit) => {
    setCurrentButtons((prevButtons) => {
      let newButtons = _.cloneDeep(prevButtons);
      newButtons[buttonIndex].subreddits = newButtons[
        buttonIndex
      ].subreddits.filter((subreddit) => subreddit !== deletedSubreddit);
      return newButtons;
    });
  };

  const deleteButton = (id) => {
    setCurrentButtons((prevButtons) => {
      const filteredButtons = prevButtons.filter((button) => button.id !== id);
      if (
        filteredButtons[filteredButtons.length - 1].text !== DEFAULT_BUTTON.text
      ) {
        // Just deleted new button
        return [...filteredButtons, { ...DEFAULT_BUTTON }];
      }
      return filteredButtons;
    });
  };

  const checkForDuplicateButton = (text) => {
    return (
      currentButtons.filter((currentButton) => currentButton.text === text)
        .length > 1
    );
  };

  if (!currentButtons) return <p>Loading your buttons...</p>;

  return (
    <fieldset id="userbuttonsettings">
      <legend>Button settings</legend>
      <p>{`${isTouchscreen ? "Tap" : "Click"} button to edit`}</p>
      <aside>
        New to Reddit? Check{" "}
        <a
          href="https://www.reddit.com/r/ListOfSubreddits/wiki/listofsubreddits"
          target="_blank"
          rel="noreferrer"
        >
          this directory
        </a>{" "}
        for inspiration for subreddits!
      </aside>
      {currentButtons.map((currentButton, i) => {
        const toggleThisButtonEdit = () => toggleButtonEdit(i);
        const keepChanges = () => toggleButtonBeingEdited(i);
        return (
          <div className="editbutton">
            <Button
              button={currentButton}
              key={`button${currentButton.id}${i}`}
              handleClick={toggleThisButtonEdit}
            />
            {buttonsBeingEdited &&
              buttonsBeingEdited[i] &&
              (() => {
                const modified = !_.isEqual(currentButton, buttons[i]);
                return (
                  <ButtonEditor
                    key={`editor${currentButton.id}${i}`}
                    currentButton={currentButton}
                    editCurrentButton={editCurrentButton}
                    deleteCurrentButtonSubreddit={deleteCurrentButtonSubreddit}
                    deleteButton={deleteButton}
                    index={i}
                    cancel={toggleThisButtonEdit}
                    modified={modified}
                    keepChanges={keepChanges}
                    isDuplicate={checkForDuplicateButton(currentButton.text)}
                  />
                );
              })()}
          </div>
        );
      })}
      <div className="formbuttons">
        <button type="button">Discard all changes</button>
        <button>Save changes</button>
      </div>
    </fieldset>
  );
};

export default ButtonSettings;
