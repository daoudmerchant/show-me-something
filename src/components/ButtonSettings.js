import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import _ from "lodash/";

// utils
import { DEFAULT_BUTTON } from "../constants";
import { fireCallbacks } from "../utils";

// API
import { updateData } from "../API/firebase/firebase";

// components
import Button from "./Button";
import ButtonEditor from "./ButtonEditor";

const ButtonSettings = ({ uid, buttons, setButtons }) => {
  const [referenceButtons, setReferenceButtons] = useState(null);
  const [currentButtons, setCurrentButtons] = useState(null);
  const [buttonsBeingEdited, setButtonsBeingEdited] = useState(null);
  const [buttonValidity, setButtonValidity] = useState(null);

  // media query
  const isTouchscreen = useMediaQuery({ query: "(hover: none)" });

  // generate id for local modification/deletion
  // Not handling repeat IDs because... Really, the likelihood...
  // Using premade IDs would involve another setState and another render
  const _getId = () => Math.random() * 100000000000000000;

  const getNewButton = (id) => {
    return { ..._.cloneDeep(DEFAULT_BUTTON), id: id || _getId() };
  };

  // Set state on render
  useEffect(() => {
    if (!buttons) return;
    const _getDefaultButtons = () => {
      return [..._.cloneDeep(buttons), getNewButton()];
    };
    fireCallbacks(_getDefaultButtons, setReferenceButtons, setCurrentButtons);

    const getObjWithFalseIdParams = () => {
      let obj = {};
      buttons.forEach((button) => (obj[button.id] = false));
      return obj;
    };
    fireCallbacks(
      getObjWithFalseIdParams,
      setButtonsBeingEdited,
      setButtonValidity
    );
  }, [buttons]);

  // tack on new button to current buttons
  useEffect(() => {
    if (!currentButtons) return;
    const lastCurrentButton = currentButtons[currentButtons.length - 1];
    if (
      lastCurrentButton.text === DEFAULT_BUTTON.text ||
      buttonsBeingEdited[lastCurrentButton.id] === true
    )
      return;
    const newId = _getId();
    setCurrentButtons((prevButtons) => {
      return [...prevButtons, getNewButton(newId)];
    });
    const _addNewButtonProp = (obj) => {
      return { ...obj, [newId]: false };
    };
    fireCallbacks(_addNewButtonProp, setButtonsBeingEdited, setButtonValidity);
  }, [currentButtons]);

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
        const buttonIndex = prevButtons.findIndex((button) => button.id === id);
        if (referenceButtons[buttonIndex]) {
          // pre-existing button
          newButtons[buttonIndex] = _.cloneDeep(referenceButtons[buttonIndex]);
        } else {
          // no ID on reference, was new button edit
          newButtons[buttonIndex] = getNewButton();
        }
        return newButtons;
      });
    }
    toggleButtonBeingEdited(id);
  };

  const confirmChanges = (id) => {
    const editedIndex = currentButtons.findIndex((button) => button.id === id);
    setReferenceButtons((prevButtons) => {
      if (editedIndex < 0) {
        // Pre-existing button
        return [
          ...prevButtons,
          _.cloneDeep(currentButtons[currentButtons.length - 1]),
        ];
      }
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
    // delete button from current and reference
    const _removeButton = (prevButtons) => {
      return prevButtons.filter((button) => button.id !== id);
    };
    fireCallbacks(_removeButton, setCurrentButtons, setReferenceButtons);
    // delete validity check and editor open/closed
    const _removeIdParam = (prevObj) => {
      let newObj = { ...prevObj };
      delete newObj[id];
      return newObj;
    };
    fireCallbacks(_removeIdParam, setButtonValidity, setButtonsBeingEdited);
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
