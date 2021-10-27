import { useState, useEffect, useMemo, useRef } from "react";
import { checkSubredditExists } from "../API/reddit";

import "../styles/ButtonEditor.css";

import { DEFAULT_BUTTON, FONTS } from "../constants/variables";

import { getId } from "../utils";

const MAX_SUBREDDITS = 3;

const ButtonEditor = ({
  currentButton,
  editCurrentButton,
  deleteCurrentButtonSubreddit,
  deleteButton,
  cancel,
  modified,
  keepChanges,
  isDuplicate,
}) => {
  const [checkingSubreddit, setCheckingSubreddit] = useState(null);
  const [subredditValidity, setSubredditValidity] = useState(null);
  const [edited, setEdited] = useState(false);
  const [newSubredditAdded, setNewSubredditAdded] = useState(false);
  const [isValidEdit, setIsValidEdit] = useState(false);

  const lastSubredditRef = useRef();

  // dependencies
  const subredditsJSON = JSON.stringify(currentButton.subreddits);

  // set state on render
  useEffect(() => {
    let blankValidity = {};
    currentButton.subreddits.forEach((subreddit) => {
      blankValidity[subreddit.id] = null;
    });
    setSubredditValidity(blankValidity);
  }, []);

  const duplicateSubreddit = useMemo(() => {
    let duplicate = false;
    currentButton.subreddits
      .map((subreddit) => subreddit.name)
      .sort()
      .reduce((prevSubreddit, thisSubreddit) => {
        if (thisSubreddit === "") return false;
        if (!prevSubreddit) return thisSubreddit;
        if (prevSubreddit === thisSubreddit) {
          duplicate = thisSubreddit;
        }
        return thisSubreddit;
      }, false);
    return duplicate;
  }, [subredditsJSON]);

  // check if valid each render
  useEffect(() => {
    // console.log(modified);
    // console.log(!isDuplicate);
    // console.log(!!currentButton.text);
    // console.log(currentButton !== DEFAULT_BUTTON.text);
    // console.log(!!currentButton.subreddits.length);
    // console.log(!duplicateSubreddit);
    // console.log(
    //   subredditValidity
    //     .filter((validity) => !!validity)
    //     .every((validity) => {
    //       return !!validity.attempt || validity.resolved || validity.exists;
    //     })
    // );
    if (
      // is not modified
      !modified ||
      // is duplicate
      isDuplicate ||
      // has no button text
      !currentButton.text ||
      // has the default button text
      currentButton.text === DEFAULT_BUTTON.text ||
      // has no subreddits
      !currentButton.subreddits.length ||
      // has duplicate subreddits
      !!duplicateSubreddit
      // ||
      // // contains unsuccessful validity checks
      // subredditValidity
      //   .filter((validity) => !!validity)
      //   .some((validity) => {
      //     return !validity.attempt || !validity.resolved || !validity.exists;
      //   })
    ) {
      if (!isValidEdit) return; // works?
      setIsValidEdit(false);
      return;
    }
    setIsValidEdit(true);
  }, [
    currentButton.text,
    currentButton.style,
    currentButton.subreddits,
    modified,
    isValidEdit,
    subredditValidity,
    isDuplicate,
    duplicateSubreddit,
  ]);

  const handleDeleteSubreddit = (subredditId) => {
    // remove subreddit from currentButton
    deleteCurrentButtonSubreddit(currentButton.id, subredditId);
    // update local state
    setCheckingSubreddit(null);
    // TODO: Manage delete subreddit while checking another(!)
    setSubredditValidity((prevSubredditValidity) => {
      let newSubredditValidity = { ...prevSubredditValidity };
      delete newSubredditValidity[subredditId];
      return newSubredditValidity;
    });
  };

  // Focus on last subreddit a new box was just made
  useEffect(() => {
    if (!newSubredditAdded || !lastSubredditRef.current) return;
    lastSubredditRef.current.focus();
    // reset state only after mount and focus
    setTimeout(() => setNewSubredditAdded(false), 0);
  }, [newSubredditAdded, setNewSubredditAdded]);

  // Check if subreddit exists on edit
  useEffect(() => {
    if (!checkingSubreddit) return;
    const currentSubreddit = currentButton.subreddits.find(
      (subreddit) => subreddit.id === checkingSubreddit
    );
    if (currentSubreddit.name === "") return;
    let isSubscribed = true;
    // subreddit unattempted
    setSubredditValidity((prevValidity) => {
      return {
        ...prevValidity,
        [checkingSubreddit]: {
          attempt: currentSubreddit.name,
          attempted: false,
          resolved: false,
        },
      };
    });
    // small delay to prevent API calls on every character edit!
    const timeout = setTimeout(async () => {
      // subreddit unresolved
      setSubredditValidity((prevValidity) => {
        return {
          ...prevValidity,
          [checkingSubreddit]: {
            ...prevValidity[checkingSubreddit],
            attempted: true,
          },
        };
      });
      try {
        const subredditIsValid = await checkSubredditExists(
          currentSubreddit.name
        );
        if (isSubscribed) {
          // subreddit resolved and does/doesn't exist
          setSubredditValidity((prevValidity) => {
            return {
              ...prevValidity,
              [checkingSubreddit]: {
                ...prevValidity[checkingSubreddit],
                resolved: true,
                ...subredditIsValid,
              },
            };
          });
        }
      } catch (error) {
        alert(error);
        // TODO: Handle error on Reddit down etc.
      }
    }, 800);

    return () => {
      clearTimeout(timeout);
      isSubscribed = false;
    };
  }, [checkingSubreddit, subredditsJSON]);

  return (
    <div className="buttoneditorform">
      <fieldset>
        <legend className="sublegend">Style</legend>
        <div className="buttonstyle">
          <div className="setting keyvaluepair">
            <label>Name:</label>
            <input
              type="text"
              value={
                currentButton.text === DEFAULT_BUTTON.text
                  ? ""
                  : currentButton.text
              }
              maxLength="12"
              placeholder="Add button text..."
              required
              onChange={(e) => {
                const value = e.target.value;
                const textValue =
                  value.length === 1 ? value.toUpperCase() : value;
                editCurrentButton({
                  buttonId: currentButton.id,
                  value: textValue,
                  param: "text",
                });
                if (edited) return;
                setEdited(true);
              }}
            />
          </div>
          <div className="duplicatewarning">
            {isDuplicate && (
              <p className="warning">Button name already exists!</p>
            )}
          </div>
          <div className="setting keyvaluepair">
            <label for="font">Font:</label>
            <select
              className="fontselect"
              name="font"
              onChange={(e) => {
                editCurrentButton({
                  buttonId: currentButton.id,
                  value: e.target.value,
                  param: "style",
                  subparam: "font",
                });
              }}
              value={currentButton.style.font}
              style={{ fontFamily: currentButton.style.font }}
            >
              {FONTS.map((font) => {
                return (
                  <option value={font} style={{ fontFamily: font }}>
                    {font}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="setting keyvaluepair">
            <label>Text Colour:</label>
            <div className="colorcontainer">
              <input
                type="color"
                value={currentButton.style.color}
                onInput={(e) => {
                  editCurrentButton({
                    buttonId: currentButton.id,
                    value: e.target.value,
                    param: "style",
                    subparam: "color",
                  });
                  if (edited) return;
                  setEdited(true);
                }}
              />
            </div>
          </div>
          <div className="setting keyvaluepair">
            <label>Background Color:</label>
            <div className="colorcontainer">
              <input
                type="color"
                value={currentButton.style.backgroundColor}
                onInput={(e) => {
                  editCurrentButton({
                    buttonId: currentButton.id,
                    value: e.target.value,
                    param: "style",
                    subparam: "backgroundColor",
                  });
                  if (edited) return;
                  setEdited(true);
                }}
              />
            </div>
          </div>
        </div>
      </fieldset>
      <fieldset>
        <legend className="sublegend">Subreddits:</legend>
        <div className="subredditlist">
          {currentButton.subreddits.map((subreddit, j) => {
            return (
              <div
                className="subredditlistitem"
                key={currentButton.id + subreddit.id}
              >
                <button
                  type="button"
                  className="delete"
                  key={`delete${subreddit.name}`}
                  onClick={() => handleDeleteSubreddit(subreddit.id)}
                >
                  Delete subreddit
                </button>
                <div className="subredditname" key={`subreddit${j}`}>
                  <p>r/</p>
                  <input
                    className="subredditinput"
                    type="text"
                    value={subreddit.name}
                    onChange={(e) => {
                      /*
                      I need to double check the button AND the subreddit
                      when I check the subreddit because something WEIRD
                      was going on with the rendering
                      */
                      editCurrentButton({
                        buttonId: currentButton.id,
                        value: e.target.value.toLowerCase(),
                        subredditId: subreddit.id,
                      });
                      setCheckingSubreddit(subreddit.id);
                    }}
                    placeholder="Add a subreddit..."
                    required={j === 0}
                    ref={
                      newSubredditAdded &&
                      j === currentButton.subreddits.length - 1
                        ? lastSubredditRef
                        : undefined
                    }
                  />
                </div>
                {!!subredditValidity &&
                  !!subredditValidity[subreddit.id] &&
                  !!subredditValidity[subreddit.id].attempted && (
                    <div className="subredditvalidity">
                      <div className="checkingstatus">
                        {!subredditValidity[subreddit.id].resolved ? (
                          <p>...</p>
                        ) : !subredditValidity[subreddit.id].exists ? (
                          <p>❌</p>
                        ) : !!subredditValidity[subreddit.id].icon ? (
                          <img
                            className="subredditicon"
                            src={subredditValidity[subreddit.id].icon}
                            alt={subredditValidity[subreddit.id].subtitle}
                          />
                        ) : (
                          <p>🙂</p>
                        )}
                      </div>
                      {subredditValidity[subreddit.id].exists && (
                        <div className="validsubredditdetails">
                          <p>{subredditValidity[subreddit.id].subreddit}</p>
                          {/* TODO: Hide subtitle if identical to subreddit? */}
                          {subredditValidity[subreddit.id].subreddit !==
                            subredditValidity[subreddit.id].subtitle && (
                            <p>{subredditValidity[subreddit.id].subtitle}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                {subreddit.name === duplicateSubreddit && (
                  <div className="duplicatesubredditalert">
                    <div className="exclamationcontainer">
                      <p>!</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {currentButton.subreddits.length < MAX_SUBREDDITS && (
            <div className="subredditlistitem">
              <div className="subredditname" id="newsubreddit">
                <p>r/</p>
                <input
                  type="text"
                  onChange={(e) => {
                    const newId = getId();
                    setCheckingSubreddit(newId);
                    editCurrentButton({
                      buttonId: currentButton.id,
                      value: e.target.value.toLowerCase(),
                      subredditId: newId,
                    });
                    setNewSubredditAdded(true);
                  }}
                  value=""
                  placeholder="Add a subreddit..."
                />
              </div>
            </div>
          )}
        </div>
      </fieldset>
      <div className="formbuttons">
        <button type="button" onClick={cancel}>
          Cancel
        </button>
        <button
          type="button"
          onClick={() => deleteButton(currentButton.id)}
          disabled={currentButton.text === DEFAULT_BUTTON.text}
        >
          Delete Button
        </button>
        <button
          type="button"
          onClick={() => {
            keepChanges();
          }}
          disabled={!isValidEdit}
        >
          Confirm changes
        </button>
      </div>
    </div>
  );
};

export default ButtonEditor;
