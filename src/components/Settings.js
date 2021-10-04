import { signOutWithGoogle } from "../API/firebase/firebase";

import { useHistory } from "react-router";

const Settings = () => {
  const history = useHistory();
  return (
    <div>
      <p>
        <span
          onClick={() => {
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
