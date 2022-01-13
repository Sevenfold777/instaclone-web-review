import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ApolloProvider, useReactiveVar } from "@apollo/client";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "styled-components";
import routes from "./routes";
import { client, darkModeVar, isLoggedInVar } from "./apollo";
import { darkTheme, GlobalStyles, lightTheme } from "./styles";
import Layout from "./components/Layout";
import Login from "./screens/Login";
import NotFound from "./screens/NotFound";
import Home from "./screens/Home";
import SignUp from "./screens/SignUp";
import Profile from "./screens/Profile";

function App() {
  // Use Reactive Var (defined at apollo.js)
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const isDarkMode = useReactiveVar(darkModeVar);
  // useReactiveVar --> Listening to the changes Of isLoggedInVar
  // Change detected --> trigger re-render (React Hook)
  // way to change isLoggedInVar? --> isLoggedInVar("CHANGE VALUE")

  return (
    <ApolloProvider client={client}>
      <HelmetProvider>
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
          <GlobalStyles />
          <Router>
            <Switch>
              <Route path={routes.home} exact>
                {isLoggedIn ? (
                  <Layout>
                    <Home />
                  </Layout>
                ) : (
                  <Login />
                )}
              </Route>
              {!isLoggedIn ? (
                <Route path={routes.signUp}>
                  <SignUp />
                </Route>
              ) : null}
              <Route path={`/users/:userName`}>
                <Layout>
                  <Profile />
                </Layout>
              </Route>
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </Router>
        </ThemeProvider>
      </HelmetProvider>
    </ApolloProvider>
  );
}

export default App;
