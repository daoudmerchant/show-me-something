import { useState } from "react";
import { NavLink } from "react-router-dom";

// styles
import "../styles/Navbar.css";

// APIs
import { signInWithGoogle } from "../API/firebase";

const NavBar = ({ user, confirmWelcomed }) => {
  // state
  const [canGetPic, setCanGetPic] = useState(true);

  return (
    <nav>
      <NavLink to="/" id="home" activeClassName="selected">
        ShowMeSomething
      </NavLink>
      <NavLink
        to="/about"
        onClick={confirmWelcomed}
        className="about"
        activeClassName="selected"
      >
        About
      </NavLink>
      {!user ? (
        <div
          className="userbar"
          onClick={() => {
            signInWithGoogle();
            confirmWelcomed();
          }}
        >
          <div id="username">
            <p className="name1">Login</p>
          </div>
          <div className="userpic">
            <p>?</p>
          </div>
        </div>
      ) : (
        <NavLink
          to="/settings"
          className="userbar"
          onClick={confirmWelcomed}
          activeClassName="selected"
        >
          <div id="username">
            {[
              user.displayName[0],
              user.displayName[user.displayName.length - 1],
            ].map((name, i) => {
              const nameId = "name" + (i + 1);
              return (
                <p className={nameId} key={nameId}>
                  {name}
                </p>
              );
            })}
          </div>
          {user.photoURL && canGetPic ? (
            <img
              className="userpic"
              src={user.photoURL}
              alt="user profile pic"
              onError={() => setCanGetPic(false)}
            />
          ) : (
            <div className="userpic">
              <p>{user.displayName.map((name) => name.slice(0, 1))}</p>
            </div>
          )}
        </NavLink>
      )}
    </nav>
  );
};

export default NavBar;
