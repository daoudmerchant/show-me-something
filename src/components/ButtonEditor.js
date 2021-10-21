import { useState, useEffect, useRef } from "react";
import { checkSubredditExists } from "../API/reddit";

import { DEFAULT_BUTTON } from "../constants";

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
  /*
    Index-based solution for checkingSubreddit, could also refactor
    to use objects with ids and Array.filter-based solution
  */
  const [checkingSubreddit, setCheckingSubreddit] = useState(null);
  const [subredditValidity, setSubredditValidity] = useState([]);
  const [edited, setEdited] = useState(false);
  const [newSubredditAdded, setNewSubredditAdded] = useState(false);
  const [isValidEdit, setIsValidEdit] = useState(false);

  // check if valid each render
  useEffect(() => {
    console.log(`Modified: ${modified}`);
    console.log(`Not a duplicate: ${!isDuplicate}`);
    console.log(`Has text: ${!!currentButton.text}`);
    console.log(
      `Is not new button text: ${!currentButton.text === DEFAULT_BUTTON.text}`
    );
    console.log(`Has subreddits: ${!!currentButton.subreddits.length}`);
    console.log(
      `Only contains valid subreddits: ${subredditValidity
        .filter((validity) => !!validity)
        .every(
          (validity) =>
            !!validity.attempt && validity.resolved && validity.exists
        )}`
    );
    if (
      !modified ||
      isDuplicate ||
      !currentButton.text ||
      currentButton.text === DEFAULT_BUTTON.text ||
      !currentButton.subreddits.length ||
      subredditValidity
        .filter((validity) => !!validity)
        .some((validity) => {
          return !validity.attempt || !validity.resolved || !validity.exists;
        })
    ) {
      // if (!isValidEdit) return;
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
  ]);

  const lastSubredditRef = useRef();

  const handleDeleteSubreddit = (subreddit, subredditIndex) => {
    // remove subreddit from currentButton
    deleteCurrentButtonSubreddit(currentButton.id, subreddit);
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
            !!subredditValidity && subredditValidity.attempt !== subreddit
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
      checkingSubreddit === null ||
      currentButton.subreddits[checkingSubreddit] === ""
    )
      return;
    let isSubscribed = true;
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
      setSubredditValidity((prevValidity) => {
        let newValidity = [...prevValidity];
        newValidity[checkingSubreddit] = {
          attempt: currentButton.subreddits[checkingSubreddit],
          resolved: false,
        };
        return newValidity;
      });
      try {
        const subredditIsValid = await checkSubredditExists(
          currentButton.subreddits[checkingSubreddit]
        );
        if (isSubscribed) {
          setSubredditValidity((prevValidity) => {
            let newValidity = [...prevValidity];
            newValidity[checkingSubreddit] = {
              attempt: currentButton.subreddits[checkingSubreddit],
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
  }, [checkingSubreddit, currentButton.subreddits[checkingSubreddit]]);

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
              editCurrentButton(currentButton.id, textValue, "text");
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
              editCurrentButton(
                currentButton.id,
                e.target.value,
                "style",
                "color"
              );
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
              editCurrentButton(
                currentButton.id,
                e.target.value,
                "style",
                "backgroundColor"
              );
              if (edited) return;
              setEdited(true);
            }}
          />
        </div>
      </fieldset>
      <fieldset>
        <legend>Subreddits:</legend>
        <div className="subredditlist">
          {currentButton.subreddits.map((subreddit, j) => {
            return (
              <>
                <button
                  type="button"
                  key={`delete${subreddit}`}
                  onClick={() => handleDeleteSubreddit(subreddit, j)}
                >
                  Delete subreddit
                </button>
                <div className="subredditlistitem" key={`subreddit${j}`}>
                  <p>r/</p>
                  <input
                    className="subredditinput"
                    type="text"
                    value={subreddit}
                    onChange={(e) => {
                      editCurrentButton(
                        currentButton.id,
                        e.target.value,
                        "subreddits",
                        j
                      );
                      setCheckingSubreddit(j);
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
                  {!!subredditValidity[j] &&
                    subredditValidity[j].attempt &&
                    !!currentButton.text && (
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
                          <>
                            <p>{subredditValidity[j].subreddit}</p>
                            {/* TODO: Hide subtitle if identical to subreddit? */}
                            <p>{subredditValidity[j].subtitle}</p>
                          </>
                        )}
                      </div>
                    )}
                </div>
              </>
            );
          })}
          {currentButton.subreddits.length < MAX_SUBREDDITS && (
            <div className="subredditlistitem newsubreddit">
              <p>r/</p>
              <input
                type="text"
                onChange={(e) => {
                  editCurrentButton(
                    currentButton.id,
                    e.target.value,
                    "subreddits",
                    currentButton.subreddits.length
                  );
                  setCheckingSubreddit(currentButton.subreddits.length);
                  setNewSubredditAdded(true);
                }}
                value=""
                placeholder="Add a subreddit..."
              />
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
