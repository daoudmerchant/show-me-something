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
  const [currentButtons, setCurrentButtons] = useState(null);
  const [buttonsBeingEdited, setButtonsBeingEdited] = useState(null);
  const [buttonValidity, setButtonValidity] = useState(null);

  // media query
  const isTouchscreen = useMediaQuery({ query: "(hover: none)" });

  // Show / hide button editor (reset buttons on hide)
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
    const clonedButtons = [..._.cloneDeep(buttons), { ...DEFAULT_BUTTON }];
    setCurrentButtons(clonedButtons);
    const falseArray = new Array(buttons.length).fill(false);
    setButtonsBeingEdited(falseArray);
    setButtonValidity(falseArray);
  }, [buttons]);

  // update current buttons on edit
  const editCurrentButton = (buttonIndex, value, param, subparam) => {
    setCurrentButtons((prevButtons) => {
      let newButtons = _.cloneDeep(prevButtons);
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
      let newButtons = _.cloneDeep(prevButtons);
      newButtons[buttonIndex].subreddits = newButtons[
        buttonIndex
      ].subreddits.filter((subreddit) => subreddit !== deletedSubreddit);
      return newButtons;
    });
  };

  const deleteButton = useCallback(
    async (id) => {
      if (!id) {
        // No ID, delete button for temporary new button
        toggleButtonEdit(currentButtons.length - 1);
        return;
      }
      const deletedButton = buttons.find((button) => button.id === id);
      const deleteSuccess = await updateData.deleteButton(uid, deletedButton);
      deleteSuccess || alert("Could not delete!");
    },
    [buttons, currentButtons, uid]
  );

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
