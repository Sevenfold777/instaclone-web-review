import {
  ApolloClient,
  ApolloLink,
  concat,
  HttpLink,
  InMemoryCache,
  makeVar,
} from "@apollo/client";

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
const httpLink = new HttpLink({ uri: "/graphql" });

// add the authorization to the headers
const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: localStorage.getItem(TOKEN) || null,
    },
  }));

  return forward(operation);
});

// initialize Apollo client
export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
});
