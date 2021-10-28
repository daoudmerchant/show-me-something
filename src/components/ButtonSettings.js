import { useState, useEffect, useMemo } from "react";
import { useMediaQuery } from "react-responsive";
import _ from "lodash/";

import "../styles/ButtonSettings.css";

// utils
import { DEFAULT_BUTTON } from "../constants/variables";
import { fireCallbacks, getId } from "../utils";

// components
import Button from "./Button";
import ButtonEditor from "./ButtonEditor";
import FormButtons from "./FormButtons";

const ButtonSettings = ({ buttons, updateFirebase }) => {
  const [submitSuccess, setSubmitSuccess] = useState(undefined);
  const [referenceButtons, setReferenceButtons] = useState(null);
  const [currentButtons, setCurrentButtons] = useState(null);
  const [buttonsBeingEdited, setButtonsBeingEdited] = useState(null);

  // media query
  const isTouchscreen = useMediaQuery({ query: "(hover: none)" });

  // JSON dependencies
  const JSONbuttons = JSON.stringify(buttons);
  const JSONreferenceButtons = JSON.stringify(referenceButtons);

  // Not handling repeat IDs because... Really, the likelihood...
  // Using premade IDs would involve another setState and another render

  const resetAll = () => {
    const defaultButtons = [
      ..._.cloneDeep(buttons).map((button) => ({
        ...button,
        id: getId(),
        subreddits: button.subreddits.map((subreddit) => ({
          name: subreddit,
          id: getId(),
        })),
      })),
      getNewButton(),
    ];
    const _getDefaultButtons = () => {
      return defaultButtons;
    };
    fireCallbacks(_getDefaultButtons, setReferenceButtons, setCurrentButtons);

    const getObjWithFalseIdParams = () => {
      let obj = {};
      buttons.forEach((button) => (obj[button.id] = false));
      return obj;
    };
    fireCallbacks(getObjWithFalseIdParams, setButtonsBeingEdited);
  };

  const getNewButton = (id) => {
    return { ..._.cloneDeep(DEFAULT_BUTTON), id: id || getId() };
  };

  // Set state on render
  useEffect(() => {
    if (!buttons) return;
    resetAll();
  }, []);

  // reset submit success on mount
  useEffect(() => {
    setSubmitSuccess(undefined);
  }, []);

  // tack on new button to current buttons
  useEffect(() => {
    if (!currentButtons) return;
    const lastCurrentButton = currentButtons[currentButtons.length - 1];
    if (
      lastCurrentButton.text === DEFAULT_BUTTON.text ||
      buttonsBeingEdited[lastCurrentButton.id] === true
    )
      return;
    const newId = getId();
    const _addNewButton = (prevButtons) => {
      return [...prevButtons, getNewButton(newId)];
    };
    fireCallbacks(_addNewButton, setCurrentButtons, setReferenceButtons);
    const _addNewButtonProp = (obj) => {
      return { ...obj, [newId]: false };
    };
    fireCallbacks(_addNewButtonProp, setButtonsBeingEdited);
  }, [buttonsBeingEdited, currentButtons]);

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
        newButtons[buttonIndex] = _.cloneDeep(referenceButtons[buttonIndex]);
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

  const findItemIndex = (array, id) => {
    return array.findIndex((obj) => obj.id === id);
  };

  // update current buttons on edit
  const editCurrentButton = ({
    buttonId,
    value,
    param,
    subparam,
    subredditId,
  }) => {
    setCurrentButtons((prevButtons) => {
      let newButtons = _.cloneDeep(prevButtons);
      const editedButtonIndex = findItemIndex(newButtons, buttonId);
      if (!!subparam) {
        newButtons[editedButtonIndex][param][subparam] = value;
      } else if (!!subredditId && !param) {
        // is subreddit edit
        const editedSubredditIndex = findItemIndex(
          newButtons[editedButtonIndex].subreddits,
          subredditId
        );
        if (editedSubredditIndex >= 0) {
          // edit to preexisting subreddit
          newButtons[editedButtonIndex].subreddits[editedSubredditIndex] = {
            ...newButtons[editedSubredditIndex].subreddits[
              editedSubredditIndex
            ],
            name: value,
            // For some reason React gets confused if I don't explicitly
            // set the ID again
            // TODO: Understand this problem better!
            id: subredditId,
          };
        } else {
          // newly added subreddit
          newButtons[editedButtonIndex].subreddits.push({
            name: value,
            id: subredditId,
          });
        }
      } else {
        newButtons[editedButtonIndex][param] = value;
      }
      return newButtons;
    });
    if (!submitSuccess) return;
    setSubmitSuccess(undefined);
  };

  const deleteCurrentButtonSubreddit = (buttonId, subredditId) => {
    setCurrentButtons((prevButtons) => {
      let newButtons = [...prevButtons];
      const editedButtonIndex = findItemIndex(newButtons, buttonId);
      newButtons[editedButtonIndex].subreddits = newButtons[
        editedButtonIndex
      ].subreddits.filter((subreddit) => subreddit.id !== subredditId);
      return newButtons;
    });
  };

  const deleteButton = (id) => {
    // delete button from current and reference
    const _removeButton = (prevButtons) => {
      const filteredButtons = prevButtons.filter((button) => button.id !== id);
      return filteredButtons;
    };
    fireCallbacks(_removeButton, setCurrentButtons, setReferenceButtons);
    // delete validity check and editor open/closed
    const _removeIdParam = (prevObj) => {
      let newObj = { ...prevObj };
      delete newObj[id];
      return newObj;
    };
    fireCallbacks(_removeIdParam, setButtonsBeingEdited);
    if (!submitSuccess) return;
    setSubmitSuccess(undefined);
  };

  const checkForDuplicateButton = (text) => {
    return (
      currentButtons.filter((currentButton) => currentButton.text === text)
        .length > 1
    );
  };

  const stripButton_s = (button_s) => {
    const _stripButton = (button) => {
      const { id, ...restOfButton } = button;
      return {
        ...restOfButton,
        subreddits: button.subreddits.map(({ id, name }) => name),
      };
    };
    if (button_s.length) {
      // array
      return button_s.slice(0, -1).map((button) => _stripButton(button));
    }
    // object
    return _stripButton(button_s);
  };

  const strippedButtons = useMemo(() => {
    if (!referenceButtons) return;
    return stripButton_s(referenceButtons);
  }, [JSONreferenceButtons]);

  const containsNewButtons = useMemo(() => {
    if (!referenceButtons) return;
    return !_.isEqual(strippedButtons, buttons);
  }, [JSONbuttons, JSONreferenceButtons]);

  if (!currentButtons) return <p>Loading your buttons...</p>;

  return (
    <form
      id="userbuttonsettings"
      onSubmit={(e) => {
        e.preventDefault();
        updateFirebase({
          type: "BUTTONS",
          data: strippedButtons,
          setSubmitSuccess,
        });
      }}
      className="settingsform"
    >
      <legend className="mainlegend">Button settings</legend>
      <p className="extradetails">{`${
        isTouchscreen ? "Tap" : "Click"
      } a button to edit`}</p>
      <aside className="extradetails">
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
                const originalButton = buttons[i];
                const strippedCurrentButton = stripButton_s(currentButton);
                const modified = !_.isEqual(
                  strippedCurrentButton,
                  originalButton
                );
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
      <FormButtons
        submitSuccess={submitSuccess}
        isDifferent={containsNewButtons}
        cancel={resetAll}
      />
    </form>
  );
};

export default ButtonSettings;
