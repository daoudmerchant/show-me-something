import "../styles/FormButtons.css";

const FormButtons = ({ submitSuccess, isDifferent, cancel }) => {
  return (
    <div className="formbuttons twobuttons">
      <div className="submitsuccess extradetails">
        {submitSuccess ? (
          <p className="successtext">Success!</p>
        ) : submitSuccess === false ? (
          <p className="failuretext">Oops, try again...</p>
        ) : submitSuccess === null ? (
          <p>...</p>
        ) : null}
      </div>
      <button
        type="button"
        disabled={!isDifferent}
        onClick={cancel}
        className="cancel"
      >
        Discard all changes
      </button>
      <button type="submit" className="submit" disabled={!isDifferent}>
        Save changes
      </button>
    </div>
  );
};

export default FormButtons;
