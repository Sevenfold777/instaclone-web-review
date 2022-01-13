import { gql, useMutation, useReactiveVar } from "@apollo/client";
import {
  faFacebookSquare,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { darkModeVar, logUserIn } from "../apollo";
import AuthLayout from "../components/auth/AuthLayout";
import BottomBox from "../components/auth/BottomBox";
import Button from "../components/auth/Button";
import FormBox from "../components/auth/FormBox";
import FormError from "../components/auth/FormError";
import Input from "../components/auth/Input";
import Notification from "../components/auth/Notification";
import Separator from "../components/auth/Seperator";
import PageTitle from "../components/PageTitle";
import routes from "../routes";

/* STYLED-COMPONENT START */
const FacebookLogin = styled.span`
  margin-top: 10px;
  margin-bottom: 20px;
  color: ${(props) => {
    const isDarkMode = useReactiveVar(darkModeVar);
    return isDarkMode ? props.theme.textColor : "#385185";
  }};
  span {
    margin-left: 10px;
    font-weight: 600;
  }
`;

const ForgotPassword = styled.span`
  color: ${(props) => {
    const isDarkMode = useReactiveVar(darkModeVar);
    return isDarkMode ? props.theme.textColor : "#00376b";
  }};
  font-size: 12px;
`;
//// Facebook Login && Forgot password are only used here
//// --> does not have to be elsewhere
/* STYLED-COMPONENT END */

/* APOLLO CLIENT */
const LOGIN_MUTATION = gql`
  mutation login($userName: String!, $password: String!) {
    # <-- "login" here can be whatever
    login(userName: $userName, password: $password) {
      # <-- "userName" should be the same with the backend TypeDefs/Resolvers; CANNOT change it
      ok
      token
      error
    }
  }
`;

function Login() {
  const location = useLocation();

  // react hook
  const {
    register,
    handleSubmit,
    formState,
    getValues,
    setError,
    clearErrors,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      userName: location?.state?.userName || "",
      password: location?.state?.password || "",
    },
  });

  // After LOGIN_MUTATION, process onCompleted
  const onCompleted = (data) => {
    const {
      login: { ok, error, token },
    } = data;

    // check completion result
    if (!ok) {
      return setError("result", { message: error }); // --> error Created once, the form is invalid
    }

    // user LOGIN
    if (token) {
      logUserIn(token);
    }
  };

  // USE LOGIN_MUTATION
  const [login, { loading }] = useMutation(LOGIN_MUTATION, { onCompleted });
  // first Return Value: function that trigger mutation
  // second Retuen Value: loadin status, data(data after mutation is invoked), called ......

  const onSubmitValid = (data) => {
    if (loading) {
      return;
    }
    const { userName, password } = getValues();

    // EXECUTE LOGIN
    login({ variables: { userName, password } });
  };

  const clearLoginError = () => {
    clearErrors("result");
  };

  return (
    <AuthLayout>
      <PageTitle title="Login" />
      <FormBox>
        <div>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
        </div>
        <Notification message={location?.state?.message} />
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            {...register("userName", {
              required: "Username is required.",
              minLength: {
                value: 3,
                message: "Username should be longer than 5 chars.",
              },
            })}
            type="text"
            placeholder="Username"
            hasError={Boolean(formState?.errors?.userName?.message)}
            onFocus={clearLoginError}
          />
          <FormError message={formState?.errors?.userName?.message} />
          <Input
            {...register("password", { required: "Password is required." })}
            type="password"
            placeholder="Password"
            hasError={Boolean(formState?.errors?.password?.message)}
            onFocus={clearLoginError}
          />
          <FormError message={formState.errors?.password?.message} />
          <Button
            type="submit"
            value={loading ? "Loading..." : "Log in"}
            disabled={!formState?.isValid || loading}
          />
          <FormError message={formState?.errors?.result?.message} />
        </form>

        <Separator />

        <FacebookLogin>
          <FontAwesomeIcon icon={faFacebookSquare} />
          <span>Log in with Facebook</span>
        </FacebookLogin>
        <ForgotPassword>ForgotPassword?</ForgotPassword>
      </FormBox>
      <BottomBox
        cta="Don't have an account?"
        linkText="Sign Up"
        link={routes.signUp}
      />
    </AuthLayout>
  );
}

export default Login;
