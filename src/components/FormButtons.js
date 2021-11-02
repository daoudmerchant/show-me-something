// styles
import "../styles/FormButtons.min.css";

const FormButtons = ({ submitSuccess, isDifferent, cancel }) => {
  return (
    <div className="formbuttons twobuttons">
      <div className="submitsuccess extradetails">
        {submitSuccess ? (
          // succeeded
          <p className="successtext">Success!</p>
        ) : submitSuccess === false ? (
          // failed
          <p className="failuretext">Oops, try again...</p>
        ) : submitSuccess === undefined ? (
          // being attempted
          <p>...</p>
        ) : isDifferent ? (
          // contains changes, show warning
          <p className="warning">Warning: Unsaved changes will be lost</p>
        ) : // null
        null}
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
