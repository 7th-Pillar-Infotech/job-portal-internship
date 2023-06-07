import React, { useState } from "react";
import { NavBar } from "../components/NavBar";
import { Grid, TextField, Button } from "@mui/material";
import "./Signup.css";
import background from "../assets/images/signup-bg.jpg";
import logo from "../assets/images/logo.png";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import swal from "sweetalert";
import { signupValidation } from "../validations/signupValidation";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [signupFormError, setSignupFormError] = useState({});
  const [signupFirebaseError, setSignupFirebaseError] = useState({});

  const signupFormValidationsHandler = async () => {
    setSignupFormError({});
    let signupFormData = {
      email,
      password,
      confirmPassword,
    };
    const output = await signupValidation(signupFormData);
    if (typeof output == "object" && output != null) {
      if (output.emailIsBlank) {
        setSignupFormError((prevState) => ({
          ...prevState,
          ["emailIsBlank"]: true,
        }));
      } else if (output.emailInvalid) {
        setSignupFormError((prevState) => ({
          ...prevState,
          ["emailIsInvalid"]: true,
        }));
      }

      if (output.passwordIsBlank) {
        setSignupFormError((prevState) => ({
          ...prevState,
          ["passwordIsBlank"]: true,
        }));
      } else if (output.passwordIsShort) {
        setSignupFormError((prevState) => ({
          ...prevState,
          ["passwordIsShort"]: true,
        }));
      } else if (output.passwordsNotSame) {
        setSignupFormError((prevState) => ({
          ...prevState,
          ["passwordsNotSame"]: true,
        }));
      }
    } else return output;
  };

  const signupButtonHandler = async () => {
    setSignupFirebaseError({});
    const res = await signupFormValidationsHandler();
    if (res === "validationsPassed") {
      setIsLoading(true);
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
          setIsLoading(false);
          navigate("/listings");
        })
        .catch((error) => {
          setIsLoading(false);
          console.log(error.code);
          switch (error.code) {
            case "auth/email-already-in-use":
              setSignupFirebaseError({
                ["emailAlreadyUsed"]: true,
              });
              break;

            default:
              swal(error.code, error.message, "error");
          }
        });
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url(" + background + ")",
        width: "100vw",
        height: "100vh",
      }}
    >
      <NavBar />
      <Grid container alignItems="center" justifyContent="center">
        <Grid item xs={9} md={3}>
          <Grid
            direction="column"
            container
            spacing={2}
            className="signup-container"
          >
            <Grid>
              <div>
                <img src={logo} width="175" height="175"></img>
              </div>
            </Grid>

            <Grid item xs={6} sm={3}>
              <TextField
                label="Email*"
                inputProps={{ style: { fontSize: 13 } }}
                variant="outlined"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setSignupFormError((prevState) => ({
                    ...prevState,
                    ["emailIsBlank"]: false,
                  }));
                }}
                size="small"
                InputLabelProps={{ style: { fontSize: 13 } }}
              />
              {signupFormError.emailIsBlank && (
                <p className="login-error">* Email is blank</p>
              )}
              {signupFormError.emailIsInvalid && (
                <p className="login-error">* Email is invalid</p>
              )}
              {signupFirebaseError.emailAlreadyUsed && (
                <p className="login-error">Email id already is use</p>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Password*"
                inputProps={{ style: { fontSize: 13 } }}
                variant="outlined"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setSignupFormError((prevState) => ({
                    ...prevState,
                    ["passwordIsBlank"]: false,
                  }));
                }}
                size="small"
                InputLabelProps={{ style: { fontSize: 13 } }}
              />
              {signupFormError.passwordIsBlank && (
                <p className="login-error">* Password is blank</p>
              )}

              {signupFormError.passwordIsShort && (
                <p className="login-error">
                  Password should be at least 6 characters
                </p>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Confirm Password*"
                inputProps={{ style: { fontSize: 13 } }}
                variant="outlined"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                size="small"
                InputLabelProps={{ style: { fontSize: 13 } }}
              />
              {signupFormError.passwordsNotSame && (
                <p className="login-error">* Passwords do not match</p>
              )}
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={signupButtonHandler}
                style={{
                  textTransform: "none",
                  width: "12.5rem",
                  borderColor: "#2bb792",
                  borderWidth: "2px",
                  backgroundColor: "#2bb792",
                  color: "white",
                  marginBottom: "2rem",
                  fontFamily: "Segoe UI",
                  fontWeight: 600,
                }}
              >
                Sign up
              </Button>
            </Grid>
          </Grid>
          {isLoading && <Loading />}
        </Grid>
      </Grid>
    </div>
  );
}

export default Signup;
