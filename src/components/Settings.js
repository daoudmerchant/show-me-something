import {
  signInWithGoogle,
  signOutWithGoogle,
  isSignedIn,
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

  if (!isSignedIn()) {
    return (
      <p>
        Please <span onClick={signInWithGoogle}>sign in</span> to change your
        settings
      </p>
    );
  }

  return (
    <div id="settingscontainer">
      <div className="signout">
        <p>
          Click here to{" "}
          <span
            onClick={() => {
              resetAllData();
              signOutWithGoogle();
              history.push("/");
            }}
          >
            sign out
          </span>{" "}
          of your account
        </p>
      </div>
      <UserSettings uid={uid} settings={settings} setSettings={setSettings} />
      <ButtonSettings uid={uid} buttons={buttons} setButtons={setButtons} />
    </div>
  );
};

export default Settings;
