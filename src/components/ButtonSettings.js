import { useState, useEffect } from "react";
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

    const getObjWithFalseIdParams = () => {
      let obj = {};
      buttons.forEach((button) => (obj[button.id] = false));
      return obj;
    };
    setButtonsBeingEdited(getObjWithFalseIdParams());
    setButtonValidity(getObjWithFalseIdParams());
  }, [buttons]);

  // Show / hide button editor
  const toggleButtonBeingEdited = (id) => {
    setButtonsBeingEdited((prevButtonsBeingEdited) => {
      let newButtonsBeingEdited = { ...prevButtonsBeingEdited };
      newButtonsBeingEdited[id] = !prevButtonsBeingEdited[id];
      return newButtonsBeingEdited;
    });
  };

  // Toggle button edit (reset buttons on hide)
  const toggleButtonEdit = (id) => {
    if (buttonsBeingEdited[id]) {
      // closing editor, cancelling edit
      setCurrentButtons((prevButtons) => {
        let newButtons = [...prevButtons];
        // cancelled edit to existing buttons
        const buttonIndex = prevButtons.findIndex((button) => button.id === id);
        newButtons[buttonIndex] = _.cloneDeep(referenceButtons[buttonIndex]);
        return newButtons;
      });
    }
    toggleButtonBeingEdited(id);
  };

  const confirmChanges = (id) => {
    const editedIndex = currentButtons.findIndex((button) => button.id === id);
    setReferenceButtons((prevButtons) => {
      let newButtons = [...prevButtons];
      newButtons[editedIndex] = _.cloneDeep(currentButtons[editedIndex]);
      return newButtons;
    });
    toggleButtonBeingEdited(id);
  };

  // update current buttons on edit
  const editCurrentButton = (id, value, param, subparam) => {
    setCurrentButtons((prevButtons) => {
      let newButtons = [...prevButtons];
      let editedButtonIndex = newButtons.findIndex(
        (button) => button.id === id
      );
      if (subparam !== undefined) {
        newButtons[editedButtonIndex][param][subparam] = value;
      } else {
        newButtons[editedButtonIndex][param] = value;
      }
      return newButtons;
    });
  };

  const deleteCurrentButtonSubreddit = (buttonIndex, deletedSubreddit) => {
    setCurrentButtons((prevButtons) => {
      let newButtons = [...prevButtons];
      newButtons[buttonIndex].subreddits = newButtons[
        buttonIndex
      ].subreddits.filter((subreddit) => subreddit !== deletedSubreddit);
      return newButtons;
    });
  };

  const deleteButton = (id) => {
    const _fireCallbacks = (cb, ...fns) => {
      fns.forEach((fn) => fn(cb));
    };
    // delete button from current and reference
    const _removeButton = (prevButtons) => {
      return prevButtons.filter((button) => button.id !== id);
    };
    _fireCallbacks(_removeButton, setCurrentButtons, setReferenceButtons);
    // delete validity check and editor open/closed
    const _removeIdParam = (prevObj) => {
      let newObj = { ...prevObj };
      delete newObj[id];
      return newObj;
    };
    _fireCallbacks(_removeIdParam, setButtonValidity, setButtonsBeingEdited);
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
        const keepChanges = () => confirmChanges(currentButton.id);
        return (
          <div className="editbutton">
            <Button
              button={currentButton}
              key={`button${currentButton.id}${i}`}
              handleClick={() => toggleButtonEdit(currentButton.id)}
            />
            {buttonsBeingEdited &&
              buttonsBeingEdited[currentButton.id] &&
              (() => {
                const modified = !_.isEqual(currentButton, referenceButtons[i]);
                return (
                  <ButtonEditor
                    key={`editor${currentButton.id}${i}`}
                    currentButton={currentButton}
                    editCurrentButton={editCurrentButton}
                    deleteCurrentButtonSubreddit={deleteCurrentButtonSubreddit}
                    deleteButton={deleteButton}
                    cancel={() => toggleButtonEdit(currentButton.id)}
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
