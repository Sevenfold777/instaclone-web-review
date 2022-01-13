import { gql, useMutation } from "@apollo/client";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import styled from "styled-components";
import AuthLayout from "../components/auth/AuthLayout";
import BottomBox from "../components/auth/BottomBox";
import Button from "../components/auth/Button";
import FormBox from "../components/auth/FormBox";
import FormError from "../components/auth/FormError";
import Input from "../components/auth/Input";
import PageTitle from "../components/PageTitle";
import { Fatlink } from "../components/shared";
import routes from "../routes";

const HeadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Subtitle = styled(Fatlink)`
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
`;

const SIGN_UP_MUTATION = gql`
  mutation (
    $firstName: String!
    $lastName: String
    $userName: String!
    $password: String!
    $email: String!
  ) {
    createAccount(
      firstName: $firstName
      lastName: $lastName
      userName: $userName
      password: $password
      email: $email
    ) {
      ok
      error
    }
  }
`;

function SignUp() {
  const history = useHistory();

  // useForm
  const {
    register,
    handleSubmit,
    formState,
    setError,
    clearErrors,
    getValues,
  } = useForm({ mode: "onChange" });

  // onCompleted for useMutation
  const onCompleted = (data) => {
    const { userName, password } = getValues();
    const {
      createAccount: { ok, error },
    } = data;

    if (!ok) {
      setError("result", { message: error });
    }
    history.push(routes.home, {
      message: "Account created. Please Log in.",
      userName,
      password,
    });
  };

  // use Mutation
  const [createAccount, { loading }] = useMutation(SIGN_UP_MUTATION, {
    onCompleted,
  });

  // onSubmitValid
  const onSubmitValid = (data) => {
    // handle loading state
    if (loading) {
      return;
    }

    // get all the inputs
    const { userName, password, email, firstName, lastName } = data;

    // execute mutation
    createAccount({
      variables: { firstName, lastName, userName, password, email },
    });
  };

  // Handling error
  const clearSignUpError = () => {
    clearErrors("result");
  };

  return (
    <AuthLayout>
      <PageTitle title="Sign up" />
      <FormBox>
        <HeadContainer>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
          <Subtitle>
            Sign up to see photos and videos from your friends.
          </Subtitle>
        </HeadContainer>

        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            {...register("firstName", { required: true })}
            type="text"
            placeholder="First Name"
            onFocus={clearSignUpError}
          />
          <FormError message={formState?.errors?.firstName?.message} />

          <Input
            {...register("lastName", { required: true })}
            type="text"
            placeholder="Last Name"
            onFocus={clearSignUpError}
          />
          <FormError message={formState?.errors?.lastName?.message} />

          <Input
            {...register("userName", { required: true })}
            type="text"
            placeholder="User Name"
            onFocus={clearSignUpError}
          />
          <FormError message={formState?.errors?.userName?.message} />

          <Input
            {...register("password", { required: true })}
            type="text"
            placeholder="Password"
            onFocus={clearSignUpError}
          />
          <FormError message={formState?.errors?.password?.message} />

          <Input
            {...register("email", { required: true })}
            type="text"
            placeholder="Email"
            onFocus={clearSignUpError}
          />
          <FormError message={formState?.errors?.email?.message} />

          <Button
            type="submit"
            value={loading ? "Loading..." : "Sign up"}
            disabled={!formState.isValid || loading}
          />
          <FormError message={formState?.errors?.result?.message} />
        </form>
      </FormBox>

      <BottomBox cta="Have an account?" linkText="Log in" link={routes.home} />
    </AuthLayout>
  );
}

export default SignUp;
