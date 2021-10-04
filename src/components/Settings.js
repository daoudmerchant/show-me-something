import { signOutWithGoogle } from "../API/firebase/firebase";

import { useHistory } from "react-router";

const Settings = ({ resetAllData }) => {
  const history = useHistory();
  return (
    <div>
      <p>
        <span
          onClick={() => {
            resetAllData();
            signOutWithGoogle();
            history.push("/");
          }}
        >
          Sign out
        </span>{" "}
        of your account
      </p>
    </div>
  );
};

export default Settings;
