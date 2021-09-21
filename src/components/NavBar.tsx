import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav>
      <Link to="/">ShowMeSomething</Link>
      <Link to="/login">Login</Link>
    </nav>
  );
};

export default NavBar;
