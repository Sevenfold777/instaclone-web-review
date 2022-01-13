import { ApolloClient, HttpLink, InMemoryCache, makeVar } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const TOKEN = "TOKEN";
const DARK_MODE = "DARK_MODE";

/* ----- Login Related Start ----- */

export const isLoggedInVar = makeVar(Boolean(localStorage.getItem(TOKEN)));
// = Reactive Vars: can see anywhere in the source codes
// How to Use --> with React Hooks

/* User Login Function - set the TOKEN */
export const logUserIn = (token) => {
  localStorage.setItem(TOKEN, token);
  isLoggedInVar(true);
};

/* User LogOut function - remove token */
export const logUserOut = (history) => {
  localStorage.removeItem(TOKEN);
  history?.replace();
  window.location.reload(); // refresh with all the previous states
};
/* ----- Login Related END ----- */

/* ----- Dark Mode Related Start ----- */
export const darkModeVar = makeVar(Boolean(localStorage.getItem(DARK_MODE)));
// Reactive Vars init

/* Dark Mode Set */
export const enableDarkMode = () => {
  localStorage.setItem(DARK_MODE, "enabled");
  darkModeVar(true);
};

/* Dark Mode UnSet */
export const disableDarkMode = () => {
  localStorage.removeItem(DARK_MODE);
  darkModeVar(false);
};
/* ----- Dark Mode Related END ----- */

/* Settings for apollo client & Advanced HTTP Networking (Request Headers)  */
// httpLink Definition
const httpLink = new HttpLink({ uri: "http://localhost:4000/" });

// add the token to the headers
/*
const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      token: localStorage?.getItem("token") || null,
    },
  }));

  return forward(operation);
});
*/

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(TOKEN);
  return {
    headers: {
      ...headers,
      token: token ? token : "",
    },
  };
});

// initialize Apollo client
export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: { User: { keyFields: (obj) => `User:${obj.userName}` } },
  }),
});
