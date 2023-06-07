import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import "./NavBarUser.css";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Menu from "@mui/material/Menu";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { reset, signin } from "../features/loggedInUserSlice";
import logo from "../assets/images/logoNavbar.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Button, Grid } from "@mui/material";

export function NavBarUser(props) {
  const dispatch = useDispatch();
  const auth = getAuth();
  const [viewUserDetails, setviewUserDetails] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const { email, uid } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleMenu = () => {
    setviewUserDetails(!viewUserDetails);
  };

  const hideUserDetails = () => {
    setviewUserDetails(false);
  };

  const logoutHandler = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const dasbhboardHandler = () => {
    navigate("/dashboard");
  };

  const homeHandler = () => {
    navigate("/listings");
  };

  const logoHandler = () => {
    navigate("/");
  };

  const getLoggedInUser = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log(user);
        const email = user.email;
        const uid = user.uid;
        dispatch(signin({ email, uid }));
        setUserLoggedIn(true);
      } else {
        dispatch(reset());
        setUserLoggedIn(false);
        console.log("No user logged in");
      }
    });
  };

  useEffect(() => {
    getLoggedInUser();
  }, []);

  const backButtonHandler = () => {
    navigate(-1);
  };

  return (
    <div className="navbaruser-div">
      <span className="helpMe">All Glory to God</span>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" style={{ background: "#025464" }}>
          <Toolbar variant="dense">
            <Grid container>
              <Grid
                item
                xs={12}
                sm={1}
                className="navbar-user-backbutton navbar-topleftcorner"
                // sx={{ display: { xs: "none", md: "inline-block" } }}
              >
                <Button
                  onClick={backButtonHandler}
                  style={{
                    color: "white",
                  }}
                >
                  <ArrowBackIosIcon />
                </Button>
              </Grid>
              <Grid item xs={12} sm={1}>
                <div className="navbar-user-logo">
                  <img
                    src={logo}
                    width="45"
                    height="35"
                    onClick={logoHandler}
                    className="logo"
                  ></img>
                </div>
              </Grid>
              <Grid item xs={12} sm={9}>
                <Typography
                  variant="subtitle1"
                  component="div"
                  sx={{ flexGrow: 1 }}
                  className="navbaruser-sentence"
                >
                  Welcome to 7th Pillar Jobs{" "}
                  <Box sx={{ display: { xs: "none", sm: "inline-block" } }}>
                    : Connecting talent with opportunity.
                  </Box>
                </Typography>
              </Grid>

              <Grid item xs={2} sm={1} className="navbar-topcorner">
                {userLoggedIn && (
                  <div>
                    <IconButton
                      aria-label="loggedInUser"
                      size="large"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={handleMenu}
                      color="inherit"
                    >
                      <AccountCircle />
                    </IconButton>
                    {viewUserDetails && (
                      <Menu
                        sx={{ mt: "5vh" }}
                        id="menu-appbar"
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        open={Boolean(viewUserDetails)}
                        onClick={hideUserDetails}
                      >
                        <div className="user-details">
                          <p>EmailId: {email}</p>
                          <div className="navbar-dashboard">
                            <p
                              className="dashboard-button"
                              onClick={dasbhboardHandler}
                            >
                              Dashboard
                            </p>

                            <p
                              className="dashboard-button"
                              onClick={homeHandler}
                            >
                              Home
                            </p>
                          </div>
                          <div className="logout">
                            <p
                              className="logout-button"
                              onClick={logoutHandler}
                            >
                              Logout{" "}
                            </p>
                          </div>
                        </div>
                      </Menu>
                    )}
                  </div>
                )}
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}
