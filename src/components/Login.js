import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import "./Login.css";
import swal from "sweetalert";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const regex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginFormError, setLoginFormError] = useState({});
  const [loginFirebaseError, setLoginFirebaseError] = useState({});

  const loginButtonHandler = () => {
    setLoginFirebaseError({});
    if (email.trim().length == 0) {
      setLoginFormError((prevState) => ({
        ...prevState,
        ["emailIsBlank"]: true,
        ["emailIsInvalid"]: false,
      }));
    } else if (!regex.test(email)) {
      setLoginFormError((prevState) => ({
        ...prevState,
        ["emailIsInvalid"]: true,
        ["emailIsBlank"]: false,
      }));
    } else {
      setLoginFormError((prevState) => ({
        ...prevState,
        ["emailIsInvalid"]: false,
        ["emailIsBlank"]: false,
      }));
    }

    if (password.trim().length == 0) {
      setLoginFormError((prevState) => ({
        ...prevState,
        ["passwordIsBlank"]: true,
      }));
    } else {
      setLoginFormError((prevState) => ({
        ...prevState,
        ["passwordIsBlank"]: false,
      }));
    }
    if (
      email.trim().length != 0 &&
      regex.test(email) &&
      password.trim().length != 0
    ) {
      setIsLoading(true);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          //Signed in
          const user = userCredential.user;
          setIsLoading(false);
          navigate("/listings");
        })
        .catch((error) => {
          setIsLoading(false);
          console.log(error.code);

          switch (error.code) {
            case "auth/user-not-found":
              setLoginFirebaseError((prevState) => ({
                ...prevState,
                ["emailIsWrong"]: true,
              }));
              break;

            case "auth/wrong-password":
              setLoginFirebaseError((prevState) => ({
                ...prevState,
                ["passwordIsWrong"]: true,
              }));
              break;

            case "auth/too-many-requests":
              setLoginFirebaseError((prevState) => ({
                ...prevState,
                ["tooManyRequests"]: true,
              }));
              break;
            default:
              swal(error.code, error.message, "error");
          }
        });
    }
  };

  const enterKeyHandler = (e) => {
    if (e.key == "Enter") {
      loginButtonHandler();
    }
  };

  return (
    <>
      {/* second container - right part  */}
      {/* <Grid item xs={11} md={4}> */}
      <div>
        <Grid
          container
          direction="column"
          spacing={2}
          className="homepage-login-box"
        >
          <Grid item>
            <Typography className="jobseeker-login-font">
              Jobseeker login
            </Typography>
            <TextField
              onChange={(event) => {
                setEmail(event.target.value);
                setLoginFormError((prevState) => ({
                  ...prevState,
                  ["emailIsBlank"]: false,
                }));
              }}
              label="Email*"
              variant="outlined"
              size="small"
              inputProps={{ style: { fontSize: 13 } }}
              InputLabelProps={{ style: { fontSize: 13 } }}
              style={{
                width: "12.5rem",
              }}
            />
            {loginFormError.emailIsBlank && (
              <p className="login-error">* Email is blank</p>
            )}

            {loginFormError.emailIsInvalid && (
              <p className="login-error">* Email is invalid</p>
            )}
            {loginFirebaseError.emailIsWrong && (
              <p className="login-error">User not found</p>
            )}
          </Grid>
          <Grid item>
            <TextField
              label="Password*"
              onChange={(event) => {
                setPassword(event.target.value);
                setLoginFormError((prevState) => ({
                  ...prevState,
                  ["passwordIsBlank"]: false,
                }));
              }}
              onKeyDown={enterKeyHandler}
              variant="outlined"
              type="password"
              size="small"
              InputLabelProps={{ style: { fontSize: 13 } }}
              inputProps={{ style: { fontSize: 13 } }}
              style={{
                width: "12.5rem",
              }}
            />
            {loginFormError.passwordIsBlank && (
              <p className="login-error">* Password is blank</p>
            )}

            {loginFirebaseError.passwordIsWrong && (
              <p className="login-error">Password is wrong</p>
            )}
          </Grid>
          <Grid item>
            {loginFirebaseError.tooManyRequests && (
              <p className="login-error">Too many requests.</p>
            )}
            <Button
              onClick={loginButtonHandler}
              variant="outlined"
              color="success"
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
              {isLoading ? <Loading /> : "Login →"}
            </Button>
          </Grid>
        </Grid>
      </div>
      {/* </Grid> */}
    </>
  );
}

export default Login;