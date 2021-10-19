import { useState, useEffect, useRef } from "react";
import { checkSubredditExists } from "../API/reddit";
import { updateData } from "../API/firebase/firebase";

const MAX_SUBREDDITS = 3;

const ButtonEditor = ({
  currentButton,
  editCurrentButton,
  deleteCurrentButtonSubreddit,
  index,
  cancel,
}) => {
  const [checkingSubreddit, setCheckingSubreddit] = useState(false);
  const [subredditValidity, setSubredditValidity] = useState([]);
  const [edited, setEdited] = useState(false);
  const [newSubredditAdded, setNewSubredditAdded] = useState(false);

  const lastSubredditRef = useRef();

  const isValidButton =
    edited &&
    !!currentButton.text &&
    (!subredditValidity.length ||
      subredditValidity.every((subreddit) => !!subreddit && subreddit.exists));

  const handleDelete = (subreddit, subredditIndex) => {
    // remove subreddit from currentButton
    deleteCurrentButtonSubreddit(index, subreddit);
    // reset last checked subreddit if deleted
    if (subredditIndex === checkingSubreddit) setCheckingSubreddit(false);
    // handle delete subreddit while checking another's validity
    if (checkingSubreddit === false || subredditIndex > checkingSubreddit)
      return;
    setCheckingSubreddit((prevCheckingSubreddit) => prevCheckingSubreddit - 1);
    // remove subreddit from saved validity info
    setSubredditValidity((prevSubredditValidity) => {
      return [
        ...prevSubredditValidity.filter(
          (subredditValidity) => subredditValidity.attempt !== subreddit
        ),
      ];
    });
  };
  // console.log(isValidButton);

  // Focus on last subreddit a new box was just made
  useEffect(() => {
    if (!newSubredditAdded || !lastSubredditRef.current) return;
    lastSubredditRef.current.focus();
    // reset state only after mount and focus
    setTimeout(() => setNewSubredditAdded(false), 0);
  }, [newSubredditAdded, setNewSubredditAdded]);
  console.log(subredditValidity);
  console.log(checkingSubreddit);

  // Check if subreddit exists on edit
  useEffect(() => {
    if (
      checkingSubreddit === false ||
      currentButton.subreddits[checkingSubreddit] === ""
    )
      return;
    let isSubscribed = true;
    setSubredditValidity((prevValidity) => {
      return [
        ...prevValidity.map((validity, i) => {
          if (i === checkingSubreddit)
            return {
              attempt: null,
            };
          return validity;
        }),
      ];
    });
    // small delay to prevent API calls on every character edit!
    const timeout = setTimeout(async () => {
      setSubredditValidity((prevValidity) => {
        const newValidity = [...prevValidity];
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

  /*
    I thought about catching the user inputting the same values as before
    and disabling the submit button, but if (for example) they're editing
    a subreddit because it stopped working, it should check its existence
    again before allowing a commit
  */

  return (
    <form>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={
            currentButton.text === "Add New Button..." ? "" : currentButton.text
          }
          maxLength="12"
          placeholder="Add button text..."
          onChange={(e) => {
            const value = e.target.value;
            const textValue = value.length === 1 ? value.toUpperCase() : value;
            editCurrentButton(index, textValue, "text");
            if (edited) return;
            setEdited(true);
          }}
        />
      </div>
      <div>
        <label>Subreddits:</label>
        <div className="subredditlist">
          {currentButton.subreddits.map((subreddit, j) => {
            return (
              <div>
                <button
                  type="button"
                  onClick={() => handleDelete(subreddit, j)}
                >
                  Delete
                </button>
                <input
                  type="text"
                  value={subreddit}
                  onChange={(e) => {
                    editCurrentButton(index, e.target.value, "subreddits", j);
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
                {!!subredditValidity[j] && subredditValidity[j].attempt && (
                  <div className="subreddit-validity">
                    <p>
                      {!subredditValidity[j].resolved
                        ? "checking"
                        : subredditValidity[j].exists
                        ? "exists"
                        : "doesn't exist"}
                    </p>
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
            );
          })}
          {currentButton.subreddits.length < MAX_SUBREDDITS && (
            <div>
              <input
                type="text"
                onChange={(e) => {
                  editCurrentButton(
                    index,
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
      </div>
      <div>
        <label>Text Colour:</label>
        <input
          type="color"
          value={currentButton.style.color}
          onInput={(e) => {
            editCurrentButton(index, e.target.value, "style", "color");
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
              index,
              e.target.value,
              "style",
              "backgroundColor"
            );
            if (edited) return;
            setEdited(true);
          }}
        />
      </div>
      <button type="button" onClick={cancel}>
        Cancel
      </button>
      <button type="submit" disabled={!isValidButton}>
        Confirm
      </button>
    </form>
  );
};

export default ButtonEditor;
