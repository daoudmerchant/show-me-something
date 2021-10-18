const ButtonEditor = ({
  currentButton = {
    text: "",
    style: {
      color: "#000000",
      backgroundColor: "#FFFFFF",
    },
    subreddits: [],
  },
  setCurrentButton,
  index,
  visible,
  cancel,
}) => {
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
  return (
    <form style={{ display: visible ? undefined : "none" }}>
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
          {currentButton.subreddits.map((subreddit) => (
            <>
              <input type="text" value={subreddit} />
              <div className="subreddit-validity">
                <p>Icon</p>
                <p>Subreddit name</p>
                <p>Subreddit description</p>
              </div>
            </>
          ))}
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
