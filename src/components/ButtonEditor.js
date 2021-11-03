import { useState, useEffect, useMemo, useRef } from "react";

// APIs
import { checkSubredditExists } from "../API/reddit";

// styles
import "../styles/ButtonEditor.min.css";

// constants
import { DEFAULT_BUTTON, FONTS, MAX_SUBREDDITS } from "../constants/variables";

// utils
import { getId } from "../utils";

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
  // STATE
  const [checkingSubreddit, setCheckingSubreddit] = useState(null);
  const [subredditValidity, setSubredditValidity] = useState(null);
  const [edited, setEdited] = useState(false);
  const [newSubredditAdded, setNewSubredditAdded] = useState(false);

  // Refs
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
  }, []); // eslint-disable-line

  const duplicateSubreddit = useMemo(() => {
    let duplicate = false;
    currentButton.subreddits
      .map((subreddit) => subreddit.name.toLowerCase())
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
    // use JSON dependency for deep object dependency
    // eslint-disable-next-line
  }, [subredditsJSON]);

  // check if valid each render
  const isValidEdit = useMemo(() => {
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
      !!duplicateSubreddit ||
      // contains unsuccessful validity checks
      (() => {
        const currentValidityChecks =
          !!subredditValidity &&
          currentButton.subreddits
            .map((subreddit) => subredditValidity[subreddit.id])
            .filter((validity) => !!validity);
        return (
          !!currentValidityChecks.length &&
          currentValidityChecks.some((validity) => {
            console.log(validity);
            return !validity.attempt || !validity.resolved || !validity.exists;
          })
        );
      })()
    ) {
      return false;
    }
    return true;
  }, [
    modified,
    isDuplicate,
    currentButton.text,
    currentButton.subreddits,
    duplicateSubreddit,
    subredditValidity,
  ]);

  const handleDeleteSubreddit = (subredditId) => {
    // remove subreddit from currentButton
    deleteCurrentButtonSubreddit(currentButton.id, subredditId);
    // UPDATE LOCAL STATE
    setCheckingSubreddit(null);
    // TODO: Manage delete subreddit while checking another(!)
    setSubredditValidity((prevSubredditValidity) => {
      let newSubredditValidity = { ...prevSubredditValidity };
      delete newSubredditValidity[subredditId];
      return newSubredditValidity;
    });
  };

  // Focus on last subreddit if a new box was just made
  useEffect(() => {
    if (!newSubredditAdded || !lastSubredditRef.current) return;
    lastSubredditRef.current.focus();
    // reset state only after mount and focus
    setTimeout(() => setNewSubredditAdded(false), 0);
  }, [newSubredditAdded, setNewSubredditAdded]);

  // CHECK SUBREDDIT VAILIDITY ON EDIT
  useEffect(() => {
    if (!checkingSubreddit) return;
    const currentSubreddit = currentButton.subreddits.find(
      (subreddit) => subreddit.id === checkingSubreddit
    );
    // ignore if duplicate or empty
    if (
      currentSubreddit.name === "" ||
      currentSubreddit.name === duplicateSubreddit
    )
      return;
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
    // use JSON dependency for deep object dependency
    // eslint-disable-next-line
  }, [checkingSubreddit, subredditsJSON]);

  return (
    <div className="buttoneditorform">
      <fieldset>
        <legend className="sublegend">Style</legend>
        <div className="buttonstyle">
          <div className="setting">
            <div className="keyvaluepair">
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
                onChange={(e) => {
                  const value = e.target.value;
                  const textValue =
                    value.slice(0, 1).toUpperCase() + value.slice(1);
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

            {isDuplicate && (
              <p className="extradetails warning">
                Button name already exists!
              </p>
            )}
          </div>

          <div className="setting keyvaluepair">
            <label htmlFor="font">Font:</label>
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
                  <option key={font} value={font} style={{ fontFamily: font }}>
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
            const thisSubredditValidity =
              !!subredditValidity && subredditValidity[subreddit.id];
            const subredditIsDuplicate =
              subreddit.name.toLowerCase() === duplicateSubreddit;
            return (
              <div
                className="subredditlistitem"
                key={currentButton.id + subreddit.id}
              >
                <div className="deletesubredditcontainer">
                  <button
                    type="button"
                    className="delete"
                    key={`delete${subreddit.name}`}
                    onClick={() => handleDeleteSubreddit(subreddit.id)}
                  >
                    ✕
                  </button>
                </div>
                <div className="subredditname" key={`subreddit${j}`}>
                  <p>r/</p>
                  <input
                    className="subredditinput"
                    type="text"
                    value={subreddit.name}
                    onChange={(e) => {
                      editCurrentButton({
                        buttonId: currentButton.id,
                        value: e.target.value.toLowerCase(),
                        subredditId: subreddit.id,
                      });
                      setCheckingSubreddit(subreddit.id);
                    }}
                    placeholder="Add a subreddit..."
                    ref={
                      newSubredditAdded &&
                      j === currentButton.subreddits.length - 1
                        ? lastSubredditRef
                        : undefined
                    }
                  />
                </div>
                <div className="icon">
                  {(() => {
                    // Is duplicate
                    if (subredditIsDuplicate)
                      return (
                        <div className="duplicatesubredditalert">
                          <div className="exclamationcontainer">
                            <p>!</p>
                          </div>
                        </div>
                      );
                    // Pre-existing, must exist
                    if (!thisSubredditValidity) return <p>🙂</p>;
                    // NEW EDIT
                    // Hasn't been attempted
                    if (!thisSubredditValidity.attempted) return null;
                    // Hasn't been resolved
                    if (!thisSubredditValidity.resolved) return <p>...</p>;
                    // Resolved, doesn't exist
                    if (!thisSubredditValidity.exists) return <p>🙁</p>;
                    // Exists!
                    // Has icon
                    if (!!thisSubredditValidity.icon)
                      return (
                        <img
                          className="subredditicon"
                          src={subredditValidity[subreddit.id].icon}
                          alt={subredditValidity[subreddit.id].subtitle}
                        />
                      );
                    // Has no icon
                    return <p>🙂</p>;
                  })()}
                </div>
                {subredditIsDuplicate ? (
                  <div className="extradetails subredditdetails">
                    <p className="warning">Duplicate subreddit</p>
                  </div>
                ) : (
                  !!thisSubredditValidity &&
                  thisSubredditValidity.exists && (
                    <div className="extradetails subredditdetails">
                      <p>{subredditValidity[subreddit.id].subreddit}</p>
                      {subredditValidity[
                        subreddit.id
                      ].subreddit.toLowerCase() !==
                        subredditValidity[
                          subreddit.id
                        ].subtitle.toLowerCase() && (
                        <p>{subredditValidity[subreddit.id].subtitle}</p>
                      )}
                    </div>
                  )
                )}
              </div>
            );
          })}
          {currentButton.subreddits.length < MAX_SUBREDDITS && (
            <div className="subredditlistitem newsubreddit">
              <div className="subredditname">
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
      <div className="formbuttons threebuttons">
        <button type="button" onClick={cancel} className="cancel">
          Cancel
        </button>
        <button
          type="button"
          onClick={() => deleteButton(currentButton.id)}
          disabled={currentButton.text === DEFAULT_BUTTON.text}
          className="delete"
        >
          Delete Button
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            keepChanges();
          }}
          disabled={!isValidEdit}
          className="submit"
        >
          Finish editing
        </button>
      </div>
    </div>
  );
};

export default ButtonEditor;
