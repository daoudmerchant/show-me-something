import { useState, useEffect, useRef, useMemo } from "react";
import { checkSubredditExists } from "../API/reddit";

import { DEFAULT_BUTTON } from "../constants";

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
  const [subredditValidity, setSubredditValidity] = useState([]);
  const [edited, setEdited] = useState(false);
  const [newSubredditAdded, setNewSubredditAdded] = useState(false);
  const [isValidEdit, setIsValidEdit] = useState(false);

  console.log(currentButton.subreddits);
  console.log(checkingSubreddit);
  console.log(subredditValidity);

  // dependencies
  const subredditsJSON = JSON.stringify(currentButton.subreddits);

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
      subredditValidity
        .filter((validity) => !!validity)
        .some((validity) => {
          return !validity.attempt || !validity.resolved || !validity.exists;
        })
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

  const lastSubredditRef = useRef();

  const handleDeleteSubreddit = (subredditId, subredditIndex) => {
    // remove subreddit from currentButton
    deleteCurrentButtonSubreddit(currentButton.id, subredditId);
    // update local state
    setCheckingSubreddit(null);
    if (
      subredditValidity[checkingSubreddit - 1] === false ||
      subredditIndex > checkingSubreddit
    )
      return;
    // TODO: Manage delete subreddit while checking another(!)
    setSubredditValidity((prevSubredditValidity) => {
      return [
        ...prevSubredditValidity.filter(
          (subredditValidity) =>
            !!subredditValidity && subredditValidity.attempt !== subredditId
        ),
      ];
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
    if (
      // not checking anything
      checkingSubreddit === null ||
      // nothing to check
      currentButton.subreddits[checkingSubreddit].name === ""
    )
      return;
    let isSubscribed = true;
    // subreddit unattempted
    setSubredditValidity((prevValidity) => {
      return prevValidity.length
        ? [
            ...prevValidity.map((validity, i) => {
              if (i === checkingSubreddit)
                return {
                  attempt: null,
                };
              return validity;
            }),
          ]
        : [{ attempt: null }];
    });
    // small delay to prevent API calls on every character edit!
    const timeout = setTimeout(async () => {
      if (checkingSubreddit === null) return;
      // subreddit unresolved
      setSubredditValidity((prevValidity) => {
        let newValidity = [...prevValidity];
        newValidity[checkingSubreddit] = {
          attempt: currentButton.subreddits[checkingSubreddit].id,
          resolved: false,
        };
        return newValidity;
      });
      try {
        const subredditIsValid = await checkSubredditExists(
          currentButton.subreddits[checkingSubreddit].name
        );
        if (isSubscribed) {
          // subreddit resolved and does/doesn't exist
          setSubredditValidity((prevValidity) => {
            let newValidity = [...prevValidity];
            newValidity[checkingSubreddit] = {
              attempt: currentButton.subreddits[checkingSubreddit].id,
              resolved: true,
              ...subredditIsValid,
            };
            return newValidity;
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
    <form
      className="buttoneditorform"
      onSubmit={(e) => {
        e.preventDefault();
        keepChanges();
      }}
    >
      <fieldset>
        <legend>Style</legend>
        <div className="buttonstyle">
          <div>
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
            {isDuplicate && <p>Button name already exists!</p>}
          </div>
          <div>
            <label>Text Colour:</label>
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
          <div>
            <label>Background Color:</label>
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
      </fieldset>
      <fieldset>
        <legend>Subreddits:</legend>
        <div className="subredditlist">
          {currentButton.subreddits.map((subreddit, j) => {
            return (
              <div className="subredditlistitem">
                <button
                  type="button"
                  key={`delete${subreddit.name}`}
                  onClick={() => handleDeleteSubreddit(subreddit.id, j)}
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
                      setCheckingSubreddit(j);
                      editCurrentButton({
                        buttonId: currentButton.id,
                        value: e.target.value.toLowerCase(),
                        subredditId: subreddit.id,
                      });
                    }}
                    placeholder="Add a subreddit..."
                    required
                    ref={
                      newSubredditAdded &&
                      j === currentButton.subreddits.length - 1
                        ? lastSubredditRef
                        : undefined
                    }
                  />
                </div>
                {!!subredditValidity[j] && subredditValidity[j].attempt && (
                  <div className="subredditvalidity">
                    <div className="checkingstatus">
                      {!subredditValidity[j].resolved ? (
                        <p>...</p>
                      ) : !subredditValidity[j].exists ? (
                        <p>❌</p>
                      ) : !!subredditValidity[j].icon ? (
                        <img
                          className="subredditicon"
                          src={subredditValidity[j].icon}
                          alt={subredditValidity[j].subtitle}
                        />
                      ) : (
                        <p>🙂</p>
                      )}
                    </div>
                    {subredditValidity[j].exists && (
                      <div className="validsubredditdetails">
                        <p>{subredditValidity[j].subreddit}</p>
                        {/* TODO: Hide subtitle if identical to subreddit? */}
                        {subredditValidity[j].subreddit !==
                          subredditValidity[j].subtitle && (
                          <p>{subredditValidity[j].subtitle}</p>
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
                    setCheckingSubreddit(currentButton.subreddits.length);
                    editCurrentButton({
                      buttonId: currentButton.id,
                      value: e.target.value.toLowerCase(),
                      subredditId: getId(),
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
        <button type="submit" disabled={!isValidEdit}>
          Confirm changes
        </button>
      </div>
    </form>
  );
};

export default ButtonEditor;
