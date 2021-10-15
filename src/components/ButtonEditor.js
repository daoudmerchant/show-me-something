const ButtonEditor = ({ currentButton, setCurrentButton, index, visible }) => {
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
            setCurrentButton(index, "text", textValue);
          }}
        />
      </div>
      <button>Cancel</button>
      <button type="submit">Confirm</button>
    </form>
  );
};

export default ButtonEditor;