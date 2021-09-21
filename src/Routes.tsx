import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// components
import NavBar from "./components/NavBar";
import App from "./App";
import Login from "./components/Login";

const Routes = () => {
  return (
    <>
      <Router>
        <NavBar />
        <Switch>
          <Route exact path="/" component={App} />
          <Route path="/login" component={Login} />
        </Switch>
      </Router>
    </>
  );
};

export default Routes;
