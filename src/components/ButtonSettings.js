import { useState, useEffect, useMemo } from "react";
import { useMediaQuery } from "react-responsive";
import _ from "lodash/";

// styles
import "../styles/ButtonSettings.min.css";

// constants
import { DEFAULT_BUTTON } from "../constants/variables";

// utils
import { fireCallbacks, getId } from "../utils";

// components
import Button from "./Button";
import ButtonEditor from "./ButtonEditor";
import FormButtons from "./FormButtons";

const ButtonSettings = ({ buttons, updateFirebase }) => {
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [referenceButtons, setReferenceButtons] = useState(null);
  const [currentButtons, setCurrentButtons] = useState(null);
  const [buttonsBeingEdited, setButtonsBeingEdited] = useState(null);

  // media query
  const isTouchscreen = useMediaQuery({ query: "(hover: none)" });

  // JSON dependencies
  const JSONbuttons = JSON.stringify(buttons);
  const JSONreferenceButtons = JSON.stringify(referenceButtons);

  // helper functions
  const getNewButton = (id) => {
    return { ..._.cloneDeep(DEFAULT_BUTTON), id: id || getId() };
  };

  const findItemIndex = (array, id) => {
    return array.findIndex((obj) => obj.id === id);
  };

  const checkForDuplicateButton = (text) => {
    return (
      currentButtons.filter((currentButton) => currentButton.text === text)
        .length > 1
    );
  };

  // strip IDs off of buttons
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

  // state management
  // reset submit success on mount
  useEffect(() => {
    setSubmitSuccess(null);
  }, []);

  const resetAll = () => {
    // apply IDs to buttons and subreddits for local management
    // Not handling repeat IDs because... Really, the likelihood...
    // TODO: Replace with '_.uniqueid()'-based solution
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

  // Show / hide button editor
  const toggleButtonBeingEdited = (id) => {
    setButtonsBeingEdited((prevButtonsBeingEdited) => {
      let newButtonsBeingEdited = { ...prevButtonsBeingEdited };
      newButtonsBeingEdited[id] = !prevButtonsBeingEdited[id];
      return newButtonsBeingEdited;
    });
    if (!submitSuccess) return;
    setSubmitSuccess(null);
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

  // Set state on render
  useEffect(() => {
    if (!buttons) return;
    resetAll();
    // use JSON dependency for deep object dependency
    // eslint-disable-next-line
  }, [JSONbuttons]);

  // tack on new button to current buttons if necessary
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

  const confirmChanges = (id) => {
    const editedIndex = findItemIndex(currentButtons, id);
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
    setSubmitSuccess(null);
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
    setSubmitSuccess(null);
  };

  const strippedButtons = useMemo(() => {
    if (!referenceButtons) return;
    return stripButton_s(referenceButtons);
    // use JSON dependency for deep object dependency
    // eslint-disable-next-line
  }, [JSONreferenceButtons]);

  const containsNewButtons = useMemo(() => {
    if (!referenceButtons) return;
    return !_.isEqual(strippedButtons, buttons);
    // use JSON dependency for deep object dependency
    // eslint-disable-next-line
  }, [JSONbuttons, JSONreferenceButtons, strippedButtons]);

  if (!currentButtons) return <p>Loading your buttons...</p>;

  return (
    <form
      id="userbuttonsettings"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitSuccess(undefined);
        updateFirebase({
          type: "BUTTONS",
          data: strippedButtons,
          setSubmitSuccess,
        });
      }}
      className="settingsform"
    >
      <legend className="mainlegend">Button Settings</legend>
      <p className="extradetails clickinstruction">
        {`${isTouchscreen ? "Tap" : "Click"} a button to edit, hit '`}
        <span className="bold">Finish editing</span>' when you're done and then{" "}
        <span className="warning">
          save your new buttons at the bottom of the page
        </span>
        !
      </p>
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
        const isNewButton = currentButton.text === DEFAULT_BUTTON.text;
        return (
          <div
            className={`editbutton${isNewButton ? " editnewbutton" : ""}`}
            key={currentButton.id}
          >
            <Button
              button={currentButton}
              key={`button${currentButton.id}${i}`}
              handleClick={() => toggleButtonEdit(currentButton.id)}
            />
            {/* Only render editor if necessary for increased performance */}
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
