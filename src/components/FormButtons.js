import "../styles/FormButtons.css";

const FormButtons = ({ submitSuccess, isDifferent, cancel }) => {
  return (
    <div className="formbuttons">
      <button type="button" disabled={!isDifferent} onClick={cancel}>
        Discard all changes
      </button>
      <button type="submit" id="settingssubmit" disabled={!isDifferent}>
        Save changes
      </button>
      {submitSuccess !== undefined &&
        (submitSuccess ? (
          <p>Success!</p>
        ) : submitSuccess === false ? (
          <p>Failure!</p>
        ) : null)}
    </div>
  );
};

export default FormButtons;
