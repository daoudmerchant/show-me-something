import { useEffect, useState } from "react";
import _ from "lodash";

import "../styles/UserSettings.css";

import FormButtons from "./FormButtons";

const UserSettings = ({ settings, updateFirebase }) => {
  const [currentSettings, setCurrentSettings] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const resetSettings = () => {
    const clonedSettings = _.cloneDeep(settings);
    setCurrentSettings(clonedSettings);
  };

  // set component settings state from current user settings
  useEffect(() => {
    if (!settings) return;
    resetSettings();
  }, [settings]);

  // reset submit success on mount
  useEffect(() => {
    setSubmitSuccess(null);
  }, []);

  const handleFormChange = (category, value) => {
    setCurrentSettings((prevSettings) => {
      return {
        ...prevSettings,
        [category]: value,
      };
    });
    if (!submitSuccess) return;
    setSubmitSuccess(null);
  };

  const BooleanOptions = ({ type }) => {
    const reportRadioChange = (e) => {
      const booleanValue = e.target.value === "true" ? true : false;
      handleFormChange(`${type}Prompt`, booleanValue);
    };
    return (
      <fieldset className="setting keyvaluepair">
        <div className="legendcontainer">
          <legend>{`Prompt before showing '${type}' posts:`}</legend>
        </div>
        <div className="radiovalues">
          <label htmlFor={`${type}Prompt`}>
            <input
              id={`${type}Prompt`}
              type="radio"
              name={type}
              value="true"
              checked={currentSettings[`${type}Prompt`] === true}
              onChange={reportRadioChange}
            />
            Yes
          </label>
          <label htmlFor={`${type}noprompt`}>
            <input
              id={`${type}noprompt`}
              type="radio"
              name={type}
              value="false"
              checked={currentSettings[`${type}Prompt`] === false}
              onChange={reportRadioChange}
            />
            No
          </label>
        </div>
      </fieldset>
    );
  };

  if (!currentSettings) {
    return <p>Loading your settings...</p>;
  }
  const { filter, limit, timeframe } = currentSettings;
  return (
    <form
      id="usersettings"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitSuccess(undefined);
        updateFirebase({
          type: "SETTINGS",
          data: currentSettings,
          setSubmitSuccess,
        });
      }}
      className="settingsform"
    >
      <legend className="mainlegend">Settings</legend>
      <div className="setting">
        <div className="keyvaluepair">
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
        </div>
        <p className="extradetails">{`Show ${(() => {
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
        <div className="keyvaluepair">
          <label htmlFor="limit">Content limit:</label>
          <div className="numbercontainer">
            <input
              type="number"
              id="limitinput"
              name="limit"
              min="1"
              max="100"
              value={limit}
              onChange={(e) => {
                // TODO: Improve limit range handling
                let value = e.target.value;
                if (value === "0" || value.length === 4) return;
                if (+value > 100) value = "100";
                if (value !== "" && +value <= 0) value = "1";
                handleFormChange("limit", value);
              }}
              onBlur={(e) => {
                // handle empty field
                const value = e.target.value;
                if (value) return;
                handleFormChange("limit", 1);
              }}
            />
            <p>(up to 100)</p>
          </div>
        </div>
        <aside className="extradetails warning">
          Note: a higher limit may lead to longer loading times
        </aside>
      </div>
      <div className="setting keyvaluepair">
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
      <BooleanOptions type="NSFW" />
      <BooleanOptions type="spoiler" />
      <FormButtons
        submitSuccess={submitSuccess}
        isDifferent={!_.isEqual(currentSettings, settings)}
        cancel={resetSettings}
      />
    </form>
  );
};

export default UserSettings;
