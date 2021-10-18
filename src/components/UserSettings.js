import { useEffect, useState, useCallback } from "react";
import { updateData } from "../API/firebase/firebase";

const UserSettings = ({ resetAllData, uid, settings, setSettings }) => {
  const [currentSettings, setCurrentSettings] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(undefined);

  // set component settings state from current user settings
  useEffect(() => {
    if (!settings) return;
    setCurrentSettings(settings);
  }, [settings]);

  // reset submit success on mount
  useEffect(() => {
    setSubmitSuccess(undefined);
  }, []);

  const updateUserSettings = useCallback(async () => {
    const result = await updateData.userSettings(uid, currentSettings);
    if (!result) {
      setSubmitSuccess(false);
      return;
    }
    setSettings(currentSettings);
    setSubmitSuccess(true);
  }, [currentSettings, setSettings, uid]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserSettings();
  };
  const handleFormChange = (category, value) => {
    setCurrentSettings((prevSettings) => {
      return {
        ...prevSettings,
        [category]: value,
      };
    });
    if (!submitSuccess) return;
    setSubmitSuccess(undefined);
  };

  if (!currentSettings) {
    return <p>Loading your settings...</p>;
  }
  const { filter, limit, timeframe } = currentSettings;
  return (
    <div className="usersettings">
      <fieldset>
        <legend>Settings</legend>
        <form id="settingsform" onSubmit={handleSubmit}>
          <div className="setting">
            <label htmlFor="filter">Filter by:</label>
            <select
              id="filterselect"
              name="filter"
              onChange={(e) => handleFormChange("filter", e.target.value)}
              value={filter}
            >
              <option value="top">Top</option>
              <option value="hot">Hot</option>
              <option value="best">Best</option>
              <option value="new">New</option>
              <option value="rising">Rising</option>
              <option value="controversial">Controversial</option>
              <option value="random">Random</option>
            </select>
            <p>{`Show ${(() => {
              // eslint-disable-next-line default-case
              switch (filter) {
                case "top":
                  return "the most popular content during your selected timeframe";
                case "hot":
                  return "content which has recently been getting positive feedback";
                case "best":
                  return "the highest rated content during your selected timeframe";
                case "new":
                  return "the latest content (good or bad!)";
                case "rising":
                  return "the content getting the most positive feedback right now";
                case "controversial":
                  return "the most equally liked and disliked content";
                case "random":
                  return "randomly selected content from within your other parameters";
              }
            })()}`}</p>
          </div>
          <div className="setting">
            <label htmlFor="limit">Content limit:</label>
            <input
              type="number"
              id="limitinput"
              min="1"
              max="100"
              value={limit}
              onChange={(e) => {
                handleFormChange("limit", e.target.value);
              }}
              onBlur={(e) => {
                // handle empty field
                const value = e.target.value;
                if (value) return;
                handleFormChange("limit", 1);
              }}
            />
            <p>(up to 100)</p>
            <aside>Note: a higher limit may lead to longer loading times</aside>
          </div>
          <div className="setting">
            <label htmlFor="timeframe">Timeframe:</label>
            <select
              id="timeframeselect"
              name="timeframe"
              onChange={(e) => handleFormChange("timeframe", e.target.value)}
              value={timeframe}
            >
              <option value="hour">The last hour</option>
              <option value="day">The last day</option>
              <option value="week">The last week</option>
              <option value="month">The last month</option>
              <option value="year">The last year</option>
              <option value="all">Forever</option>
            </select>
          </div>
          <button
            type="submit"
            id="settingssubmit"
            disabled={currentSettings === settings}
          >
            Submit
          </button>
          {submitSuccess ? (
            <p>Success!</p>
          ) : submitSuccess === false ? (
            <p>Failure!</p>
          ) : null}
        </form>
      </fieldset>
    </div>
  );
};

export default UserSettings;
