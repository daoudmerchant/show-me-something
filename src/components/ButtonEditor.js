import { useCallback, useState, useEffect } from "react";
import { checkSubredditExists } from "../API/reddit";
import { updateData } from "../API/firebase/firebase";

const ButtonEditor = ({ currentButton, setCurrentButton, index, cancel }) => {
  /*
    ADDING / MODIFYING SUBREDDITS

    Assuming my form validation is correct, subreddits for current
    buttons are all VALID

    - On each modified character, it checks it restarts the timer (0.8s-ish)
    - When the timer finishes, the API is queried
    - During this time, the user has feedback that Reddit is being consulted
    - The API returns either
    {
      exists: false
    }
    or 
    {
      exists: true,
      name,
      description
    }
    
    The subreddits are 

  */
  const [checkingSubreddit, setCheckingSubreddit] = useState(false);
  const [subredditValidity, setSubredditValidity] = useState([]);

  useEffect(() => {
    if (checkingSubreddit === false) return;
    let isSubscribed = true;
    setSubredditValidity((prevValidity) => {
      const newValidity = [...prevValidity];
      delete newValidity[checkingSubreddit];
      return newValidity;
    });
    // small delay to prevent API calls on every character edit!
    const timeout = setTimeout(async () => {
      console.log(
        `checking for ${currentButton.subreddits[checkingSubreddit]}`
      );
      setSubredditValidity((prevValidity) => {
        const newValidity = [...prevValidity];
        newValidity[checkingSubreddit] = { resolved: false };
        return newValidity;
      });
      try {
        const subredditIsValid = await checkSubredditExists(
          currentButton.subreddits[checkingSubreddit]
        );
        if (isSubscribed) {
          setSubredditValidity((prevValidity) => {
            const newValidity = [...prevValidity];
            newValidity[checkingSubreddit] = {
              resolved: true,
              ...subredditIsValid,
            };
            return newValidity;
          });
        }
      } catch (error) {
        // TODO: Handle error on Reddit down etc.
      }
    }, 800);

    return () => {
      clearTimeout(timeout);
      isSubscribed = false;
    };
  }, [checkingSubreddit, currentButton.subreddits[checkingSubreddit]]);

  return (
    <form>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={currentButton.text}
          maxLength="12"
          onChange={(e) => {
            const value = e.target.value;
            const textValue = value.length === 1 ? value.toUpperCase() : value;
            setCurrentButton(index, textValue, "text");
          }}
        />
      </div>
      <div>
        <label>Subreddits:</label>
        <div className="subredditlist">
          {currentButton.subreddits.map((subreddit, j) => {
            return (
              <>
                <input
                  type="text"
                  value={subreddit}
                  onChange={(e) => {
                    setCurrentButton(index, e.target.value, "subreddits", j);
                    setCheckingSubreddit(j);
                  }}
                />
                {subredditValidity[j] && (
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
                        <p>{subredditValidity[j].subtitle}</p>
                      </>
                    )}
                  </div>
                )}
              </>
            );
          })}
        </div>
      </div>
      <div>
        <label>Text Colour:</label>
        <input
          type="color"
          value={currentButton.style.color}
          onInput={(e) => {
            setCurrentButton(index, e.target.value, "style", "color");
          }}
        />
      </div>
      <div>
        <label>Background Color:</label>
        <input
          type="color"
          value={currentButton.style.backgroundColor}
          onInput={(e) => {
            setCurrentButton(index, e.target.value, "style", "backgroundColor");
          }}
        />
      </div>
      <button type="button" onClick={cancel}>
        Cancel
      </button>
      <button type="submit">Confirm</button>
    </form>
  );
};

export default ButtonEditor;
