import { useCallback } from "react";
import {
  signInWithGoogle,
  signOutWithGoogle,
  isSignedIn,
  updateData,
} from "../API/firebase/firebase";

import { useHistory } from "react-router";

// components
import UserSettings from "./UserSettings";
import ButtonSettings from "./ButtonSettings";

const Settings = ({
  resetAllData,
  uid,
  settings,
  setSettings,
  buttons,
  setButtons,
}) => {
  const history = useHistory();

  const updateFirebase = useCallback(
    async ({ type, data, setSubmitSuccess }) => {
      const dataCategory = type === "SETTINGS" ? "userSettings" : "userButtons";
      const setUserState = type === "SETTINGS" ? setSettings : setButtons;
      const result = await updateData[dataCategory](uid, data);
      if (!result) {
        setSubmitSuccess(false);
        return;
      }
      setUserState(data);
      setSubmitSuccess(true);
    },
    [setButtons, setSettings, uid]
  );

  if (!isSignedIn()) {
    return (
      <p>
        Please <span onClick={signInWithGoogle}>sign in</span> to change your
        settings
      </p>
    );
  }

  if (!settings || !buttons || !uid) return <p>Loading your settings...</p>;

  return (
    <div id="settingscontainer">
      <div className="signout">
        <p>
          Click{" "}
          <span
            onClick={() => {
              resetAllData();
              signOutWithGoogle();
              history.push("/");
            }}
          >
            here
          </span>{" "}
          to sign out of your account
        </p>
      </div>
      <UserSettings settings={settings} updateFirebase={updateFirebase} />
      <ButtonSettings buttons={buttons} updateFirebase={updateFirebase} />
    </div>
  );
};

export default Settings;
